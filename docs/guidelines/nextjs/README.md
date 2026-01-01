# Next.js Guidelines

This directory contains comprehensive guidelines for Next.js 15.5.9 development, focusing on performance optimization, bundle management, and best practices specific to Next.js App Router.

## 📚 Available Guidelines

### 1. [ISR Optimization Guidelines](./ai_isr_optimization_guidelines.md)
**ISR Optimization Guidelines for Next.js 15.5.9**

Comprehensive guidelines for implementing ISR (Incremental Static Regeneration) to optimize page performance:
- When to use ISR
- Basic setup with `revalidate`
- On-demand revalidation in Server Actions
- Using `revalidateTag` for precise cache invalidation
- Examples for different page types
- Integration with middleware and authentication
- Best practices and troubleshooting
- AWS Amplify Hosting compatibility

**Key Topics:**
- ISR vs SSG vs SSR
- Choosing revalidation intervals
- Combining `revalidatePath` and `revalidateTag`
- Authentication and authorization with ISR
- Performance optimization strategies

### 2. [Bundle Optimization & Analyze Guidelines](./ai_bundle_analyze_steps.md)
**Next.js Bundle Optimization & Analyze Guidelines**

Guidelines for optimizing bundle size and analyzing JavaScript bundles:
- Principles of bundle optimization
- Server Components by default
- Dynamic imports for heavy libraries
- Bundle analysis and reporting
- Performance targets and limits

**Key Topics:**
- Server-side data preparation
- Client component islands
- Dynamic imports patterns
- Bundle size analysis
- Dependency management

## 🎯 Key Principles

All Next.js guidelines follow these core principles:

1. **Next.js 15.5.9 Compatibility**: All guidelines are tested and verified for Next.js 15.5.9
2. **AWS Amplify Hosting**: Full compatibility with AWS Amplify Hosting
3. **Performance First**: Optimize for performance and user experience
4. **Server Components Default**: Use Server Components by default, Client Components only when needed
5. **Type Safety**: Full TypeScript support with explicit typing
6. **Security**: Maintain security with authentication and authorization
7. **Documentation**: Clear examples and AI assistant instructions

## 🚀 Usage

### For AI Assistants

When working on Next.js tasks, refer to these guidelines:

1. **For page optimization**: Use [ISR Optimization Guidelines](./ai_isr_optimization_guidelines.md)
2. **For bundle optimization**: Use [Bundle Optimization Guidelines](./ai_bundle_analyze_steps.md)
3. **For component creation**: Refer to [React Guidelines](../react/README.md)

### For Developers

1. **Read the relevant guideline** before starting a task
2. **Follow the examples** provided in each guideline
3. **Check AWS Amplify compatibility** for any Next.js features
4. **Test performance** after implementing optimizations

## 📖 Recommended Reading Order

1. **Start with**: [ISR Optimization Guidelines](./ai_isr_optimization_guidelines.md) - for understanding page performance optimization
2. **Then read**: [Bundle Optimization Guidelines](./ai_bundle_analyze_steps.md) - for understanding bundle size optimization
3. **Also refer to**: [React Guidelines](../react/README.md) - for component development patterns

## 🔗 Related Documentation

### Architecture & Infrastructure
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [AWS Amplify Configuration](../../infrastructure/AWS_AMPLIFY.md)
- [AWS Amplify Compatibility](../../infrastructure/AMPLIFY_COMPATIBILITY.md)

### Optimization & Performance
- [ISR Optimization Analysis](../../optimization/GRADES_PAGES_ISR_OPTIMIZATION.md)
- [Optimization Documentation](../../optimization/README.md)

### API & Data
- [Server Actions Documentation](../../api/SERVER_ACTIONS.md)
- [Data Flow Documentation](../../architecture/DATA_FLOW.md)

### React Guidelines
- [React Components Guidelines](../react/ai_component_guidelines.md)
- [React Hooks Guidelines](../react/ai_react_hooks_guidelines.md)
- [React Utilities Guidelines](../react/ai_react_utilities_guidelines.md)

---

**Last Updated:** 27 December 2025  
**Project:** Sunday School App  
**Next.js Version:** 15.5.9

