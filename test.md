# Advanced Quality Assurance & Testing Documentation

**Project Name:** MyGreenGarden Planner App
**Platform:** React Native (Expo) - iOS & Android
**Testing Strategy:** Advanced Multi-Tiered Testing Strategy (Manual & Automated)
**Date:** 2026-05-15

## 1. Executive Summary
This document outlines the comprehensive testing architecture and QA protocols implemented for the MyGreenGarden Planner App. Shifting from a purely manual Feature-Driven Testing strategy, this advanced approach integrates automated Unit, Integration, and End-to-End (E2E) testing to ensure platform stability, data integrity, and a premium User Experience (UX).

## 2. Test Environment & Tooling
| Component | Technology / Tool | Description |
|-----------|-------------------|-------------|
| **Framework** | Expo SDK & React Native | Core application framework |
| **Unit Testing** | Jest & React Native Testing Library | Testing discrete UI components and utility functions |
| **E2E Testing** | Detox | Automated black-box testing on emulators/simulators |
| **Emulation** | Android Emulator (API 33) & iOS Simulator | Cross-platform validation |
| **State Management** | Context API & AsyncStorage | Local persistence and global state validation |
| **Performance** | React Native Performance Monitor | Framerate (FPS) and memory leak tracking |

## 3. Automated Testing Scope (Planned/Implemented)

### 3.1 Unit Testing
Focused on individual functions and isolated UI components.
* **Calculations:** Validating the Yield/Spacing logic within the `CalculatorScreen`.
* **State Updates:** Ensuring reducers correctly toggle `isFavourite` and update the global theme.
* **Component Rendering:** Snapshot testing for reusable UI elements (e.g., custom buttons, input fields) to prevent UI regressions.

### 3.2 Integration Testing
Verifying the interaction between different app modules.
* **Navigation Flow:** Ensuring correct routing from `PlantListScreen` -> `PlantDetailScreen`.
* **Data Persistence:** Verifying that saving a plant to favourites in the UI correctly updates `AsyncStorage` and reflects in the `FavouritesScreen`.
* **Theme Switching:** Validating that toggling Dark Mode in `PreferencesScreen` dynamically updates context and applies the correct styling properties across all active screens.

### 3.3 End-to-End (E2E) Testing
Simulating real user journeys using Detox.
* **Core Onboarding:** Launch -> View Plant List -> Select Plant -> Read Detail.
* **Addition Flow:** Navigate to Add Guide -> Fill Form -> Submit -> Verify new entry in the list.

## 4. Manual Feature-Driven Testing & Results

*(Note: The following represents the manual testing passes executed to validate core functionality prior to full CI/CD automation.)*

### 4.1 Home / Plant List Navigation
* **Action:** Launch app and navigate the main plant list.
* **Expected:** Smooth rendering of the `PlantListScreen` with plant images and titles.
* **Result:** ✅ **Pass** - FlatList renders at 60fps without lag.

### 4.2 Plant Detail & Favouriting
* **Action:** Select a plant, review details, and tap "Add to Favourites".
* **Expected:** Plant is marked as favoured, icon state changes, and data is persisted.
* **Result:** ✅ **Pass** - Immediate UI feedback; state persists after app reload.

### 4.3 Favourites Management
* **Action:** Open `FavouritesScreen` and remove an item.
* **Expected:** Item immediately disappears from the list, and context is updated.
* **Result:** ✅ **Pass**

### 4.4 Add Custom Guide
* **Action:** Open `AddGuideScreen`, input custom plant data, submit.
* **Expected:** Form validates inputs, saves the guide, and appends it to the main list.
* **Result:** ✅ **Pass** - Validation catches empty fields; successful save updates list.

### 4.5 Garden Space/Yield Calculator
* **Action:** Enter plot dimensions and plant type in `CalculatorScreen`.
* **Expected:** Real-time calculation of required seeds and estimated yield.
* **Result:** ✅ **Pass** - Edge cases (negative numbers, non-numeric characters) handled gracefully.

### 4.6 Theme & Typography Preferences
* **Action:** Toggle Dark/Light mode and adjust font size in `PreferencesScreen`.
* **Expected:** Application-wide re-render applying the new theme and typography rules immediately.
* **Result:** ⚠️ **Partial Pass / Fail** - Theme switches correctly. *Known Issue: Font size changes only reflect on the Preferences screen. Requires a Context Provider update to force a re-render on all screens.*

## 5. Performance & Security Metrics
* **UI Responsiveness:** Target 60 FPS maintained during FlatList scrolling and animations.
* **Memory Management:** No significant memory leaks observed during continuous navigation loops between List and Detail screens.
* **Data Security:** All local data (Favourites, Custom Guides) stored securely via AsyncStorage. No sensitive PII collected.

## 6. Future QA Roadmap
1. **CI/CD Integration:** Integrate GitHub Actions to run Jest suites automatically on Pull Requests.
2. **Detox Automation:** Convert the manual test cases (Section 4) into automated Detox scripts.
3. **Accessibility Testing:** Audit color contrast ratios and VoiceOver/TalkBack compatibility for all screens.
