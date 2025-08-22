# Task Completion Validator

## Overview
This steering document provides comprehensive guidelines for AI agents to systematically validate completed tasks, ensure quality standards, and verify nothing is missed during implementation phases.

## Validation Workflow

### Phase 1: Task Group Completion Check
When a group of related tasks is marked as completed, the agent MUST:

1. **Read All Project Context**
   - Review `.kiro/specs/*/requirements.md` for original requirements
   - Consult `.kiro/specs/*/design.md` for design specifications
   - Check `.kiro/specs/*/tasks.md` for task details and dependencies
   - Review all `.kiro/steering/*.md` files for project standards
   - Check `project_rules.md` and `user_rules.md` if they exist

2. **Analyze Task Dependencies**
   - Verify all prerequisite tasks are truly complete
   - Check for any blocking dependencies
   - Ensure proper task sequence was followed
   - Validate that sub-tasks are complete before parent tasks

3. **Cross-Reference Requirements**
   - Map completed tasks back to original requirements
   - Ensure all acceptance criteria are met
   - Verify no requirements were overlooked
   - Check for scope creep or missing functionality

### Phase 2: Implementation Quality Audit

#### Code Quality Verification
```typescript
// Use these validation criteria for all code implementations:

interface CodeQualityChecklist {
  typescript_compliance: {
    strict_mode: boolean;
    proper_interfaces: boolean;
    no_any_types: boolean;
    return_types_defined: boolean;
  };
  
  architecture_compliance: {
    follows_project_structure: boolean;
    uses_path_aliases: boolean;
    proper_component_patterns: boolean;
    separation_of_concerns: boolean;
  };
  
  performance_standards: {
    core_web_vitals_optimized: boolean;
    proper_code_splitting: boolean;
    image_optimization: boolean;
    bundle_size_acceptable: boolean;
  };
  
  accessibility_compliance: {
    wcag_2_1_aa_compliant: boolean;
    keyboard_navigation: boolean;
    screen_reader_support: boolean;
    proper_aria_labels: boolean;
  };
}
```

#### SEO & Design Standards Verification
- **Metadata Completeness**: Every page has proper title, description, Open Graph tags
- **Structured Data**: Appropriate JSON-LD schema implementation
- **Design System Adherence**: Uses predefined classes and components
- **Brand Consistency**: Follows Brokeranalysis visual standards
- **Mobile Responsiveness**: Works across all device sizes

#### Broker-Specific Requirements
- **Trust Score Integration**: Properly implemented where relevant
- **Regulatory Compliance**: Includes necessary disclaimers and regulatory info
- **Evidence-Based Content**: Claims supported by credible sources
- **Financial Accuracy**: All financial information is current and correct

### Phase 3: Functional Testing Protocol

#### Manual Testing Checklist
```markdown
## User Journey Testing
- [ ] Can users complete primary workflows without errors?
- [ ] Are all interactive elements functional?
- [ ] Do forms validate properly and submit successfully?
- [ ] Are loading states and error messages appropriate?
- [ ] Does the feature work as intended across browsers?

## Integration Testing
- [ ] Do new components integrate properly with existing systems?
- [ ] Are API calls working correctly?
- [ ] Is data flowing properly between components?
- [ ] Are real-time features functioning as expected?

## Performance Testing
- [ ] Page load times meet performance targets (<2.5s LCP)
- [ ] No console errors or warnings
- [ ] Memory usage is acceptable
- [ ] No layout shifts or visual glitches
```

#### Automated Testing Requirements
- **Unit Tests**: All new functions and components have tests
- **Integration Tests**: API endpoints and data flows are tested
- **E2E Tests**: Critical user journeys are covered
- **Accessibility Tests**: Automated a11y testing passes

### Phase 4: MCP Server Utilization

#### Required MCP Server Checks
When available, utilize these MCP servers for comprehensive validation:

1. **AWS Documentation MCP** (if configured)
   - Verify cloud architecture best practices
   - Check for security compliance
   - Validate deployment configurations

2. **GitHub MCP** (if configured)
   - Review commit history for completeness
   - Check for proper branching strategy
   - Validate pull request requirements

3. **Database MCP** (if configured)
   - Verify database schema changes
   - Check for proper indexing
   - Validate data migration scripts

4. **Security Scanning MCP** (if configured)
   - Run security vulnerability scans
   - Check for exposed secrets or keys
   - Validate authentication implementations

#### MCP Server Integration Protocol
```typescript
// Example MCP server utilization pattern
interface MCPValidationProtocol {
  pre_validation: {
    check_mcp_availability: boolean;
    identify_relevant_servers: string[];
    prepare_validation_queries: string[];
  };
  
  validation_execution: {
    run_automated_checks: boolean;
    collect_validation_results: boolean;
    identify_issues: boolean;
  };
  
  post_validation: {
    compile_findings: boolean;
    prioritize_issues: boolean;
    generate_action_items: boolean;
  };
}
```

### Phase 5: Documentation and Knowledge Base Update

#### Documentation Requirements
- **Code Documentation**: All new functions and components are documented
- **API Documentation**: Endpoints are properly documented
- **User Documentation**: Features have user-facing documentation
- **Technical Documentation**: Architecture decisions are recorded

#### Knowledge Base Updates
- Update project README if new features affect setup
- Add new components to design system documentation
- Update deployment guides if infrastructure changes
- Record lessons learned and best practices

### Phase 6: Stakeholder Communication

#### Progress Reporting Template
```markdown
## Task Group Completion Report

### Completed Tasks
- [x] Task 1: Description and validation status
- [x] Task 2: Description and validation status
- [x] Task 3: Description and validation status

### Quality Assurance Results
- **Code Quality**: ✅ Passed all checks
- **Performance**: ✅ Meets Core Web Vitals targets
- **Accessibility**: ✅ WCAG 2.1 AA compliant
- **SEO**: ✅ All metadata and structured data implemented
- **Security**: ✅ No vulnerabilities detected

### Issues Identified
- **Critical**: None
- **Important**: [List any important issues found]
- **Minor**: [List any minor issues found]

### Next Steps
- [List any follow-up actions required]
- [Identify next task group to begin]
- [Note any dependencies or blockers]
```

## Validation Triggers

### Automatic Validation Triggers
- When all tasks in a logical group are marked complete
- Before major feature releases
- After significant code changes
- Weekly comprehensive reviews

### Manual Validation Triggers
- User requests validation review
- Before client presentations
- Prior to production deployments
- When issues are reported

## Error Detection and Resolution

### Common Issues to Check For
1. **Incomplete Implementations**
   - Features that appear complete but lack edge case handling
   - Missing error states or loading indicators
   - Incomplete responsive design implementations

2. **Integration Problems**
   - Components that don't work well together
   - API integration issues
   - Data flow problems between features

3. **Performance Issues**
   - Slow loading components
   - Memory leaks
   - Inefficient re-renders

4. **Accessibility Gaps**
   - Missing ARIA labels
   - Poor keyboard navigation
   - Insufficient color contrast

5. **SEO Deficiencies**
   - Missing or poor metadata
   - Lack of structured data
   - Poor internal linking

### Resolution Protocol
1. **Immediate Issues**: Fix critical problems immediately
2. **Important Issues**: Schedule fixes within current sprint
3. **Minor Issues**: Add to backlog for future sprints
4. **Enhancement Opportunities**: Document for future consideration

## Continuous Improvement

### Learning Integration
- Document patterns that work well
- Identify common mistakes to avoid
- Update validation criteria based on findings
- Share knowledge across team members

### Process Refinement
- Regularly review and update validation criteria
- Incorporate new tools and techniques
- Adapt to changing project requirements
- Optimize validation efficiency

## Success Metrics

### Quality Indicators
- **Zero Critical Issues**: No blocking problems in completed work
- **Performance Targets Met**: All Core Web Vitals within acceptable ranges
- **Accessibility Compliance**: 100% WCAG 2.1 AA compliance
- **SEO Optimization**: All pages properly optimized
- **User Satisfaction**: Positive feedback on completed features

### Efficiency Metrics
- **First-Pass Success Rate**: Percentage of tasks that pass validation on first review
- **Issue Detection Rate**: How quickly problems are identified
- **Resolution Time**: How quickly identified issues are resolved
- **Regression Prevention**: How well validation prevents future issues

This comprehensive validation approach ensures that completed work meets all project standards and requirements while maintaining the high quality expected for the Brokeranalysis platform.