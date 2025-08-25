'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataService } from '@/lib/services/dataService';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        // Sample team data for Brokeranalysis platform
        const sampleTeamMembers: TeamMember[] = [
          {
            id: "member-1",
            name: "Sarah Chen",
            role: "Financial Analyst",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: "member-2",
            name: "Michael Rodriguez",
            role: "Broker Research Lead",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          }
        ];
        
        setTeamMembers(sampleTeamMembers);
      } catch (error) {
        console.error('Error loading team data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative space-y-4">
              {[1, 2].map((index) => (
                <Card key={index} className={`modern-card-hover max-w-xs animate-pulse ${
                  index === 1 ? 'ml-0' : 'ml-12'
                }`}>
                  <CardContent className="p-4">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-6 bg-white/10 rounded mb-3"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                      <div className="h-4 bg-white/10 rounded flex-1"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-white/10 rounded w-32"></div>
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-20 bg-white/10 rounded"></div>
              <div className="h-10 bg-white/10 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="section-spacing">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Team Cards */}
          <div className="relative space-y-4">
            {teamMembers.map((member, index) => (
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