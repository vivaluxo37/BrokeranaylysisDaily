import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockTeamMembers } from '@/app/modernLandingMockData';

export const TeamManagement: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Team Cards */}
          <div className="relative space-y-4">
            {mockTeamMembers.map((member, index) => (
              <Card 
                key={member.id} 
                className={`modern-card-hover max-w-xs ${
                  index === 0 ? 'ml-0' : 'ml-12'
                }`}
              >
                <CardContent className="p-4">
                  <div className="text-sm text-white/60 mb-1">Role</div>
                  <div className="text-lg font-semibold text-white mb-3">
                    {member.role}
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-white/80">{member.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card">
              <span className="text-sm text-white/80">Central platform</span>
            </div>
            
            <h2 className="text-heading-lg text-white">
              Manage your team in{' '}
              <span className="text-gradient">one place</span>
            </h2>
            
            <p className="text-body text-white/70 leading-relaxed">
              Centralise your team management. Manage your entire team in one tool. 
              Easy communication, project management, and smooth collaboration with your team.
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

export default TeamManagement;