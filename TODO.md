# Enhance Gold Vault Security Site Legitimacy — Implementation Plan

## Overview
Add robust legitimacy signals to Iron Vault Security to demonstrate transparency, third-party verification, and multi-layered defenses that distinguish a legitimate vault operation from scams.

---

## Steps

### Step 1: Create `security-compliance.html`
- [x] New dedicated page covering all legitimacy signals
- [x] Physical Security: UL TL-30X6, EN 1143-1 Grade 10+, 90-ton steel doors, time locks, airtight seals, reinforced concrete
- [x] Access Controls: Biometric (fingerprint, iris, facial), MFA, dual-control, mantraps, visitor protocols
- [x] Surveillance: 24/7 CCTV, motion detectors, seismic/tamper sensors, sound/thermal detection, off-site monitoring, armed response
- [x] Environmental: Climate control, fire suppression, flood protection, redundant power, disaster resistance
- [x] Location & Perimeter: Secure low-profile site, fencing, metal detectors, law enforcement integration
- [x] Allocated/Segregated Storage: Serial numbers, weights, assay certificates, proof of ownership
- [x] Insurance: Comprehensive "all-risk", Lloyd's of London, market-value coverage
- [x] Independent Audits: Bureau Veritas/EY, physical count/weight/serial verification, quarterly/annual reports
- [x] Accreditations: LBMA compliance, "loco London", IRS approval for precious metals IRAs
- [x] Transparency: Clear contracts, no high-pressure sales, controlled withdrawals
- [x] Employee Screening: Background checks, bonding, internal risk policies

### Step 2: Enhance `about.html`
- [ ] Add company history and founding principles
- [ ] Add operational security philosophy
- [ ] Add employee vetting and bonding section
- [ ] Add trust signals and anti-scam transparency statements

### Step 3: Enhance `services.html`
- [x] Add physical security specs per tier
- [x] Add insurance coverage details per tier
- [x] Add audit frequency per tier
- [x] Add LBMA compliance note
- [x] Add environmental controls per service category

### Step 4: Enhance `index.html`
- [ ] Add accreditation/trust badge section (LBMA, Lloyd's, ISO)
- [ ] Add "Why We're Legitimate" trust signals section
- [ ] Add link to new Security & Compliance page
- [ ] Strengthen Schema.org structured data with security features

### Step 5: Update Navigation Across All Pages
- [x] Add "Security & Compliance" link to header nav on all HTML pages
- [x] Add "Security & Compliance" link to mobile menu on all HTML pages
- [x] Update footer links on all pages to include new page
- [x] Pages to update: index.html, about.html, services.html, login.html, signup.html, client-portal.html, admin-dashboard.html, request-access.html, search.html, forgot-password.html

### Step 6: Create `data/compliance.json`
- [ ] Store audit report metadata
- [ ] Store certification details
- [ ] Store insurance policy references
- [ ] Store accreditation status

### Step 7: Update `client-portal.html`
- [ ] Add security compliance summary panel
- [ ] Add insurance coverage display for client's tier
- [ ] Add audit status indicator

### Step 8: Verification
- [ ] Verify all internal links work
- [ ] Test responsive layout on mobile
- [ ] Ensure Schema.org markup validates

---

## Bug Fixes Completed
- [x] Fix `services.html`: unclosed `<div>` tags, missing closing tags for sections
- [x] Fix `admin-dashboard.html`: unclosed `<div>` tags, missing `</div>` for top-bar, mobile-menu-overlay, sections
- [x] Fix `security-compliance.html`: remove duplicated content sections, fix unclosed tags
- [x] Extract `admin-dashboard.html` inline JS to `js/admin.js` to prevent truncation
- [x] Add missing `</section>` and `</div>` closings across pages
