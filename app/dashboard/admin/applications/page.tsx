'use client';

import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Search, Filter, Mail, Phone, Calendar, Award } from 'lucide-react';

interface Application {
  _id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    education?: string;
  };
  projectIdea: {
    title: string;
    description: string;
    stage: string;
  };
  status: string;
  submittedAt: string;
  score?: {
    overall: number;
  };
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, page]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const statusParam = selectedStatus !== 'all' ? `&status=${selectedStatus}` : '';
      const response = await fetch(`/api/applications?page=${page}&limit=20${statusParam}`);
      const data = await response.json();
      
      setApplications(data.applications || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.projectIdea.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    'under-review': applications.filter(a => a.status === 'under-review').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'under-review': 'bg-blue-100 text-blue-800 border-blue-200',
      interview: 'bg-purple-100 text-purple-800 border-purple-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      waitlisted: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">Review and manage program applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedStatus === status
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</p>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {application.personalInfo.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {application.personalInfo.fullName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {application.personalInfo.email}
                        </span>
                        {application.personalInfo.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {application.personalInfo.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {application.score && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-lg">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {application.score.overall.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Project: {application.projectIdea.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{application.projectIdea.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    Stage: {application.projectIdea.stage}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Submitted {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                  <a
                    href={`/dashboard/admin/applications/${application._id}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Review Application →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
