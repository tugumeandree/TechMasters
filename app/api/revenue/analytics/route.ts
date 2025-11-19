import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import RevenueTransaction from '@/models/RevenueTransaction';
import ParticipantSubscription from '@/models/ParticipantSubscription';
import Sponsorship from '@/models/Sponsorship';

// GET /api/revenue/analytics - Get revenue analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const fiscalYear = searchParams.get('fiscalYear') || new Date().getFullYear().toString();
    const period = searchParams.get('period') || 'year'; // year, quarter, month

    // Total revenue by category
    const revenueByCategory = await RevenueTransaction.aggregate([
      {
        $match: {
          status: 'completed',
          fiscalYear: parseInt(fiscalYear)
        }
      },
      {
        $group: {
          _id: '$accountingCategory',
          totalRevenue: { $sum: '$netAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue by quarter
    const revenueByQuarter = await RevenueTransaction.aggregate([
      {
        $match: {
          status: 'completed',
          fiscalYear: parseInt(fiscalYear)
        }
      },
      {
        $group: {
          _id: '$fiscalQuarter',
          totalRevenue: { $sum: '$netAmount' },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Subscription metrics
    const subscriptionMetrics = await ParticipantSubscription.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$pricingModel',
          count: { $sum: 1 },
          totalMRR: {
            $sum: {
              $cond: [
                { $eq: ['$pricing.paymentSchedule', 'monthly'] },
                '$pricing.baseAmount',
                {
                  $cond: [
                    { $eq: ['$pricing.paymentSchedule', 'quarterly'] },
                    { $divide: ['$pricing.baseAmount', 3] },
                    {
                      $cond: [
                        { $eq: ['$pricing.paymentSchedule', 'semester'] },
                        { $divide: ['$pricing.baseAmount', 6] },
                        { $divide: ['$pricing.baseAmount', 12] }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    ]);

    // Calculate MRR and ARR
    const totalMRR = subscriptionMetrics.reduce((sum, item) => sum + (item.totalMRR || 0), 0);
    const totalARR = totalMRR * 12;

    // Active sponsorships
    const activeSponsorships = await Sponsorship.countDocuments({ status: 'active' });
    const sponsorshipRevenue = await Sponsorship.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalInvestment' }
        }
      }
    ]);

    // Participant counts by pricing model
    const participantsByPricing = await ParticipantSubscription.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$pricingModel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment collection rate
    const paymentStats = await ParticipantSubscription.aggregate([
      {
        $unwind: '$payments'
      },
      {
        $group: {
          _id: '$payments.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payments.amount' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        fiscalYear: parseInt(fiscalYear),
        overview: {
          totalRevenue: revenueByCategory.reduce((sum, cat) => sum + cat.totalRevenue, 0),
          totalTransactions: revenueByCategory.reduce((sum, cat) => sum + cat.count, 0),
          mrr: totalMRR,
          arr: totalARR,
          activeSponsorships,
          sponsorshipRevenue: sponsorshipRevenue[0]?.totalRevenue || 0
        },
        revenueByCategory,
        revenueByQuarter,
        subscriptionMetrics,
        participantsByPricing,
        paymentStats
      }
    });
  } catch (error: any) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
