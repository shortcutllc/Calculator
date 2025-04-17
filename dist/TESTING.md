# Testing Checklist Before Going Live

## Functionality Tests
- [ ] Preset Loading
  - [ ] All service types load correctly (massage/spa, hair/nails, headshot)
  - [ ] All preset sizes work (small, medium, large)
  - [ ] Form fields update correctly
  - [ ] Error handling works for invalid presets

- [ ] Calculation Logic
  - [ ] Basic calculations work for all service types
  - [ ] Early arrival fees are calculated correctly
  - [ ] Retouching costs are included for headshots
  - [ ] Margin calculations are accurate
  - [ ] Multi-day calculations work

- [ ] UI/UX
  - [ ] All logos load correctly
  - [ ] Favicon displays properly
  - [ ] Responsive design works on all screen sizes
  - [ ] Success/error messages display correctly
  - [ ] Form validation works

## Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Performance
- [ ] Page loads under 2 seconds
- [ ] Calculations are instantaneous
- [ ] No memory leaks in long sessions
- [ ] Assets are properly cached

## Security
- [ ] Password protection works
- [ ] No sensitive data exposed in frontend code
- [ ] Form inputs are properly sanitized
- [ ] No console errors expose internal logic

## How to Run Tests
1. Start the local server:
   ```bash
   cd "dist 3"
   python3 -m http.server 8000
   ```

2. Open test suite:
   ```
   http://localhost:8000/test.html
   ```

3. Click "Run Tests" and check results

## Known Issues
- Port 8000 sometimes remains in use (kill with `lsof -ti:8000 | xargs kill -9`)
- Favicon.ico 404 is expected (using SVG instead)

## Deployment Checklist
1. Run all automated tests
2. Manual testing of critical paths
3. Browser compatibility check
4. Performance audit
5. Security review
6. Backup current production
7. Deploy changes
8. Verify deployment
9. Monitor for issues 