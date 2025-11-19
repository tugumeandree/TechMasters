import StatsCounter from './StatsCounter';

export default function StatsSection() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-primary-100">
            Transforming Africa's tech ecosystem, one innovator at a time
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <StatsCounter
            end={500}
            suffix="+"
            label="Participants Trained"
          />
          <StatsCounter
            end={150}
            suffix="+"
            label="Projects Launched"
          />
          <StatsCounter
            end={100}
            suffix="+"
            label="Expert Mentors"
          />
          <StatsCounter
            end={85}
            suffix="%"
            label="Success Rate"
          />
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <div className="text-3xl font-bold mb-2">$5M+</div>
            <div className="text-primary-100">Funding Raised</div>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <div className="text-3xl font-bold mb-2">50+</div>
            <div className="text-primary-100">Corporate Partners</div>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <div className="text-3xl font-bold mb-2">200+</div>
            <div className="text-primary-100">Real Customers</div>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <div className="text-3xl font-bold mb-2">15+</div>
            <div className="text-primary-100">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
}
