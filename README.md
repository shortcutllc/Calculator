# Shortcut Calculator

## Current Stable Version
- **Last Known Good Commit:** `main@188ebcb`
- **Date:** Current as of March 2024
- **Status:** Production-ready

### Working Features in Stable Version
- Password protection (password: LouieJack1!)
- Single event calculator
- Multi-day calculator
- Blue logo implementation
- Proposal generation
- History functionality
- All styling and design elements

## Development Guidelines

### 1. Maintaining Stable State
```bash
# To revert to last known good version:
git reset --hard 188ebcb
git push -f origin main
```

### 2. Adding New Features
1. **Always branch from stable commit:**
   ```bash
   git checkout 188ebcb
   git checkout -b feature/new-feature-name
   ```

2. **Development Rules:**
   - DO NOT modify existing working code
   - Only add new code/features
   - Keep all current styling and functionality
   - Test thoroughly before merging

### 3. Before Major Changes
- Verify current stable commit hash
- Document working features
- Create new branch for changes
- Test in isolation before merging

### 4. Deployment Checklist
- [ ] All existing features working
- [ ] Password protection functional
- [ ] Calculator functions working
- [ ] Styling preserved
- [ ] New features tested
- [ ] Mobile responsiveness checked

## Feature Documentation

### Password Protection
- Location: Entry point of application
- Password: LouieJack1!
- Implementation: Session-based authentication

### Calculator Features
- Single Event Calculator
  - Service type selection
  - Duration and professional calculations
  - Cost and revenue calculations

- Multi-Day Calculator
  - Multiple location support
  - Per-day configurations
  - Aggregate calculations

### Design Elements
- Color Scheme:
  - Primary: #FF5050 (Red)
  - Secondary: #175071 (Blue)
  - Accent Colors:
    - #FFEB69 (Yellow)
    - #9EFAFF (Light Blue/Teal)
    - #F9CDFF (Light Purple)

## Recovery Procedures
If issues occur:
1. Document the current state
2. Identify the last working commit
3. Use git reset to restore stable version
4. Rebuild new features incrementally

## Contact
For questions or issues, contact the development team. 