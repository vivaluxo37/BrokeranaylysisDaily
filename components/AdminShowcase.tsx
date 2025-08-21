import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

export const AdminShowcase: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Dashboard Mockup */}
          <div className="relative">
            <div className="modern-card p-8 max-w-sm mx-auto lg:mx-0">
              {/* Mobile Dashboard Mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Tasks</span>
                  <span className="text-white font-semibold">2,000</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Finance Reporting', status: 'completed' },
                    { name: 'Revenue Forecasting', status: 'in-progress' },
                    { name: 'Business Proposal', status: 'pending' },
                    { name: 'Update Leadership', status: 'completed' },
                    { name: 'Finance Leadership', status: 'in-progress' }
                  ].map((task, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'completed' ? 'bg-green-400' :
                        task.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-white/80 text-sm">{task.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card">
              <span className="text-sm text-white/80">Easy admin</span>
            </div>
            
            <h2 className="text-heading-lg text-white">
              Take the pain out of{' '}
              <span className="text-gradient">company admin</span>
            </h2>
            
            <p className="text-body text-white/70 leading-relaxed">
              Eliminate the hassle, nobody wants it. Take the pain out of company admin with our 
              all-in-one platform. Simplify projects and focus on what really drives your business forward.
            </p>
            
            <Button className="btn-gradient">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminShowcase;