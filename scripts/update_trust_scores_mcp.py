#!/usr/bin/env python3
"""
Trust Score Update Script using MCP Server

This script calculates trust scores for all brokers using the new algorithm
and updates them via the Supabase MCP server.
"""

import json
from datetime import datetime
from typing import Dict, Any, List

# Trust Score Weights
TRUST_SCORE_WEIGHTS = {
    'regulation': 0.30,
    'financial_stability': 0.25,
    'user_feedback': 0.20,
    'transparency': 0.15,
    'platform_reliability': 0.10
}

# Project ID
PROJECT_ID = 'gngjezgilmdnjffxwquo'

def calculate_regulation_score(factors: Dict[str, Any]) -> int:
    """Calculate regulation score based on regulatory factors"""
    score = 0
    
    # Primary regulator scoring (40 points)
    regulator_scores = {
        'FCA': 40, 'CFTC': 40, 'BaFin': 40,
        'ASIC': 38, 'FINMA': 38, 'MAS': 38,
        'CySEC': 35, 'FSA': 35,
        'FSCA': 32,
        'CIMA': 25,
        'VFSC': 20,
        'FSC': 18
    }
    
    primary_regulator = factors.get('primary_regulator', 'Unknown')
    score += regulator_scores.get(primary_regulator, 15)
    
    # Additional licenses bonus (15 points)
    additional_licenses = factors.get('additional_licenses', [])
    if isinstance(additional_licenses, list):
        score += min(len(additional_licenses) * 3, 15)
    
    # Regulatory history (25 points)
    history_scores = {
        'clean': 25,
        'minor_issues': 15,
        'major_issues': 5
    }
    regulatory_history = factors.get('regulatory_history', 'clean')
    score += history_scores.get(regulatory_history, 15)
    
    # Jurisdiction tier (20 points)
    jurisdiction_scores = {
        'tier1': 20,
        'tier2': 15,
        'tier3': 10,
        'offshore': 5
    }
    jurisdiction_tier = factors.get('jurisdiction_tier', 'tier3')
    score += jurisdiction_scores.get(jurisdiction_tier, 10)
    
    return min(score, 100)

def calculate_financial_stability_score(factors: Dict[str, Any]) -> int:
    """Calculate financial stability score"""
    score = 0
    
    # Public trading status (20 points)
    if factors.get('publicly_traded', False):
        score += 20
    elif factors.get('parent_company') and factors.get('parent_company') != 'Independent':
        score += 15
    else:
        score += 10
    
    # Capital adequacy (30 points)
    capital_scores = {
        'strong': 30,
        'adequate': 20,
        'weak': 10
    }
    capital_adequacy = factors.get('capital_adequacy', 'adequate')
    score += capital_scores.get(capital_adequacy, 20)
    
    # Insurance coverage (25 points)
    insurance_coverage = factors.get('insurance_coverage', 0)
    if insurance_coverage >= 1000000:
        score += 25
    elif insurance_coverage >= 500000:
        score += 20
    elif insurance_coverage >= 100000:
        score += 15
    elif insurance_coverage > 0:
        score += 10
    
    # Years in business (25 points)
    years_in_business = factors.get('years_in_business', 0)
    if years_in_business >= 20:
        score += 25
    elif years_in_business >= 10:
        score += 20
    elif years_in_business >= 5:
        score += 15
    elif years_in_business >= 2:
        score += 10
    else:
        score += 5
    
    return min(score, 100)

def calculate_user_feedback_score(factors: Dict[str, Any]) -> int:
    """Calculate user feedback score"""
    score = 0
    
    # Average rating (40 points)
    average_rating = factors.get('average_rating', 3.0)
    score += (average_rating / 5.0) * 40
    
    # Review volume credibility (20 points)
    total_reviews = factors.get('total_reviews', 0)
    if total_reviews >= 1000:
        score += 20
    elif total_reviews >= 500:
        score += 18
    elif total_reviews >= 100:
        score += 15
    elif total_reviews >= 50:
        score += 12
    elif total_reviews >= 10:
        score += 8
    else:
        score += 5
    
    # Recent trend (15 points)
    trend_scores = {
        'improving': 15,
        'stable': 10,
        'declining': 5
    }
    recent_trend = factors.get('recent_trend', 'stable')
    score += trend_scores.get(recent_trend, 10)
    
    # Withdrawal complaints penalty (15 points)
    withdrawal_complaints = factors.get('withdrawal_complaints', 0)
    withdrawal_penalty = min(withdrawal_complaints * 2, 15)
    score += max(15 - withdrawal_penalty, 0)
    
    # Support rating (10 points)
    support_rating = factors.get('support_rating', 3.0)
    score += (support_rating / 5.0) * 10
    
    return min(score, 100)

def calculate_transparency_score(factors: Dict[str, Any]) -> int:
    """Calculate transparency score"""
    score = 0
    
    # Each factor worth 20 points
    if factors.get('pricing_clarity', False):
        score += 20
    if factors.get('terms_accessibility', True):  # Default to true
        score += 20
    if factors.get('regulatory_disclosures', False):
        score += 20
    if factors.get('fee_transparency', False):
        score += 20
    if factors.get('conflict_of_interest', False):
        score += 20
    
    return min(score, 100)

def calculate_platform_reliability_score(factors: Dict[str, Any]) -> int:
    """Calculate platform reliability score"""
    score = 0
    
    # Uptime percentage (40 points)
    uptime_percentage = factors.get('uptime_percentage', 99.5)
    if uptime_percentage >= 99.9:
        score += 40
    elif uptime_percentage >= 99.5:
        score += 35
    elif uptime_percentage >= 99.0:
        score += 30
    elif uptime_percentage >= 98.0:
        score += 20
    else:
        score += 10
    
    # Execution quality (30 points)
    execution_scores = {
        'excellent': 30,
        'good': 25,
        'average': 15,
        'poor': 5
    }
    execution_quality = factors.get('execution_quality', 'good')
    score += execution_scores.get(execution_quality, 15)
    
    # Technical issues penalty (20 points)
    technical_issues = factors.get('technical_issues', 1)
    issues_penalty = min(technical_issues * 3, 20)
    score += max(20 - issues_penalty, 0)
    
    # Server locations bonus (10 points)
    server_locations = factors.get('server_locations', 1)
    location_bonus = min(server_locations * 2, 10)
    score += location_bonus
    
    return min(score, 100)

def extract_trust_score_factors(broker: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Extract trust score factors from broker data"""
    regulation_info = broker.get('regulation_info', {})
    current_year = datetime.now().year
    founded_year = broker.get('founded_year')
    years_in_business = current_year - founded_year if founded_year else 0
    
    # Regulation factors
    regulation_factors = {
        'primary_regulator': regulation_info.get('primary_regulator', 'Unknown'),
        'additional_licenses': regulation_info.get('additional_licenses', []),
        'regulatory_history': regulation_info.get('regulatory_history', 'clean'),
        'jurisdiction_tier': regulation_info.get('jurisdiction_tier', 'tier3')
    }
    
    # Financial stability factors
    financial_stability_factors = {
        'parent_company': broker.get('parent_company', 'Independent'),
        'publicly_traded': broker.get('publicly_traded', False),
        'capital_adequacy': regulation_info.get('capital_adequacy', 'adequate'),
        'insurance_coverage': regulation_info.get('insurance_coverage', 0),
        'years_in_business': years_in_business
    }
    
    # User feedback factors
    user_feedback_factors = {
        'average_rating': broker.get('user_reviews_average', 3.0),
        'total_reviews': broker.get('user_reviews_count', 0),
        'recent_trend': 'stable',  # Default
        'withdrawal_complaints': 0,  # Default
        'support_rating': broker.get('customer_service_score', 3.0)
    }
    
    # Transparency factors
    transparency_factors = {
        'pricing_clarity': (broker.get('transparency_score', 0) or 0) >= 70,
        'terms_accessibility': True,  # Default assumption
        'regulatory_disclosures': broker.get('regulatory_compliance', False),
        'fee_transparency': (broker.get('fees_score', 0) or 0) >= 70,
        'conflict_of_interest': broker.get('third_party_audits', False)
    }
    
    # Platform reliability factors
    server_locations = broker.get('server_locations', [])
    platform_reliability_factors = {
        'uptime_percentage': 99.5,  # Default assumption
        'execution_quality': 'good',  # Default assumption
        'technical_issues': 1,  # Default assumption
        'slippage_reports': 0,
        'server_locations': len(server_locations) if isinstance(server_locations, list) else 1
    }
    
    return {
        'regulation': regulation_factors,
        'financial_stability': financial_stability_factors,
        'user_feedback': user_feedback_factors,
        'transparency': transparency_factors,
        'platform_reliability': platform_reliability_factors
    }

def calculate_broker_trust_score(broker: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate complete trust score for a broker"""
    factors = extract_trust_score_factors(broker)
    
    # Calculate individual component scores
    regulation_score = calculate_regulation_score(factors['regulation'])
    financial_stability_score = calculate_financial_stability_score(factors['financial_stability'])
    user_feedback_score = calculate_user_feedback_score(factors['user_feedback'])
    transparency_score = calculate_transparency_score(factors['transparency'])
    platform_reliability_score = calculate_platform_reliability_score(factors['platform_reliability'])
    
    # Calculate weighted overall score
    overall_score = (
        regulation_score * TRUST_SCORE_WEIGHTS['regulation'] +
        financial_stability_score * TRUST_SCORE_WEIGHTS['financial_stability'] +
        user_feedback_score * TRUST_SCORE_WEIGHTS['user_feedback'] +
        transparency_score * TRUST_SCORE_WEIGHTS['transparency'] +
        platform_reliability_score * TRUST_SCORE_WEIGHTS['platform_reliability']
    )
    
    overall_score = round(overall_score, 2)
    
    return {
        'overall': overall_score,
        'regulation': {
            'score': regulation_score,
            'weight': TRUST_SCORE_WEIGHTS['regulation'],
            'factors': factors['regulation']
        },
        'financial_stability': {
            'score': financial_stability_score,
            'weight': TRUST_SCORE_WEIGHTS['financial_stability'],
            'factors': factors['financial_stability']
        },
        'user_feedback': {
            'score': user_feedback_score,
            'weight': TRUST_SCORE_WEIGHTS['user_feedback'],
            'factors': factors['user_feedback']
        },
        'transparency': {
            'score': transparency_score,
            'weight': TRUST_SCORE_WEIGHTS['transparency'],
            'factors': factors['transparency']
        },
        'platform_reliability': {
            'score': platform_reliability_score,
            'weight': TRUST_SCORE_WEIGHTS['platform_reliability'],
            'factors': factors['platform_reliability']
        },
        'last_updated': datetime.now().isoformat(),
        'methodology': 'Broker Analysis Trust Score v1.0 - Evidence-based scoring across 5 key dimensions'
    }

def main():
    """Main function to demonstrate trust score calculation"""
    print("Broker Analysis Trust Score Calculator")
    print("=" * 40)
    print("\nThis script demonstrates the trust score calculation algorithm.")
    print("To update actual broker data, use the TypeScript service in the application.")
    
    # Example broker data
    example_broker = {
        'id': 'example-broker',
        'name': 'Example Broker',
        'founded_year': 2010,
        'regulation_info': {
            'primary_regulator': 'FCA',
            'additional_licenses': ['CySEC', 'ASIC'],
            'regulatory_history': 'clean',
            'jurisdiction_tier': 'tier1',
            'capital_adequacy': 'strong',
            'insurance_coverage': 1000000
        },
        'user_reviews_average': 4.2,
        'user_reviews_count': 150,
        'customer_service_score': 4.0,
        'transparency_score': 75,
        'fees_score': 80,
        'regulatory_compliance': True,
        'third_party_audits': True,
        'server_locations': ['London', 'New York', 'Tokyo']
    }
    
    # Calculate trust score
    trust_score = calculate_broker_trust_score(example_broker)
    
    print(f"\nExample Trust Score Calculation for {example_broker['name']}:")
    print(f"Overall Trust Score: {trust_score['overall']}/100")
    print("\nComponent Breakdown:")
    for component, data in trust_score.items():
        if isinstance(data, dict) and 'score' in data:
            print(f"  {component.replace('_', ' ').title()}: {data['score']}/100 (weight: {data['weight']})")
    
    print("\n✓ Trust score calculation completed!")
    print("\nTo implement this in the application:")
    print("1. Use the TypeScript service at lib/services/trustScoreService.ts")
    print("2. Call updateAllBrokerTrustScores() from your application")
    print("3. The service will update all brokers in the database")

if __name__ == '__main__':
    main()