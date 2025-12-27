# Premium Upgrade Release Notes

## 💎 New "Midnight Gold" Luxury Design
We have completely overhauled the UI to justify a premium price point.
- **Deep Space Background**: A subtle, animated radial gradient that breathes.
- **Glassmorphism**: The board and header now feature a high-end frosted glass effect (`backdrop-filter`).
- **Gold Accents**: Primary actions and user inputs use a metallic gold (`#d4af37`) color palette.
- **Modern Typography**: Integrated the 'Outfit' font for a clean, geometric look.
- **Tactile Controls**: Buttons now feel more physical with refined hover and active states.

## 🧠 Gameplay Enhancements
- **Limited Hints**: Hints are now capped at **3 per game** to maintain challenge and value.
  - Button displays `Hint (x/3)`.
  - Disables automatically when depleted.
- **Improved Feedback**: Error states now have a subtle "shake" animation.

## 📱 Mobile Polish
- Optimized touch targets for easier play on phones.
- prevented overscrolling for a native app feel.

## Next Steps for Deployment
To update your Android App with these changes:
1. Run `npm run build`
2. Run `npx cap sync`
3. Build the new Bundle/APK in Android Studio.
