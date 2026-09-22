# Theoretical Topic: Layout Constraints & Responsive Design

This document details the layout theory, constraint mechanics, and responsive design techniques utilized in **Swifty Companion** to ensure consistent rendering across varying screen geometries, aspect ratios, and platforms.

---

## 1. The Flexbox Algorithm & Layout Constraints

### 1.1 Understanding Constraint-Based Layouts
Traditional desktop UI design frequently relied on absolute positioning (explicit $(X, Y)$ pixel coordinates). In mobile development, absolute positioning fails due to the vast diversity of device viewports, screen densities, and dynamic system elements.

Modern mobile platforms implement **constraint-based layout algorithms**. React Native uses **Yoga**, a high-performance C++ implementation of the W3C **Flexbox** specification optimized for mobile architectures.

### 1.2 Core Flexbox Dimensions
* **Main Axis vs. Cross Axis:**  
  * By default in React Native, `flexDirection` is `'column'` (the Main Axis is vertical, Cross Axis is horizontal).
  * In rows (e.g., stats or headers), `flexDirection: 'row'` aligns children horizontally.
* **Alignment Properties:**
  * `justifyContent`: Distributes children along the Main Axis (`center`, `space-between`, `space-around`).
  * `alignItems`: Aligns children along the Cross Axis (`center`, `stretch`, `flex-start`).
* **Flex Ratios (`flex: 1`):**  
  Directs a component to expand and occupy all remaining available space within its parent container.

### 1.3 Implementation in Swifty Companion
In [`src/screens/ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js), the student metrics row demonstrates Flexbox alignment:

```javascript
statsRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
  paddingVertical: 8,
  borderTopWidth: 1,
  borderColor: "#27272a",
  marginBottom: 12,
}
```
`justifyContent: "space-around"` mathematically calculates the width of the display and evenly apportions horizontal padding around each metric box.

---

## 2. Dynamic Progress Bars & Normalized Gauges

### 2.1 The Math of Clamped Percentage Layouts
The reusable [`src/components/ProgressBar.js`](file:///home/silvia/GitHub/swifty-companion/src/components/ProgressBar.js) converts arbitrary numerical values into a responsive visual gauge.

To prevent visual overflow when a metric exceeds expectations or drops below zero, the component applies mathematical clamping:

$$\text{clamped} = \min(\max(\text{percentage}, 0), 100)$$

The track fill uses relative percentage widths:
```javascript
<View style={styles.track}>
  <View style={[styles.fill, { width: `${clamped}%` }]} />
</View>
```
Because the fill width is specified as `${clamped}%` rather than fixed pixels, the gauge automatically stretches or contracts proportionally on small mobile phones, tablets, or full-width desktop browsers.

---

## 3. Hardware Insets & Safe Area Boundaries

### 3.1 The Notch & System Gesture Challenge
Modern mobile devices feature physical display intrusions:
* Rounded display corners
* Camera notches and Dynamic Islands
* Android system gesture bars
* iOS Home Indicator bars

Rendering content outside the "safe area" results in clipped buttons or obstructed text.

### 3.2 SafeAreaProvider Architecture
In [`App.js`](file:///home/silvia/GitHub/swifty-companion/App.js), the entire application is enclosed in `<SafeAreaProvider>`:

```javascript
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```
This provider queries the underlying operating system for display insets ($top, bottom, left, right$) and prevents interactive UI elements from being covered by hardware obstructions.

---

## 4. Scrollable Viewports & Content Overflow

### 4.1 Fixed vs. Fluid Viewports
When displaying data-heavy screens like `ProfileScreen` (containing avatar, statistics, skill bars, and dozens of project entries), the total height of the content exceeds the physical height of standard smartphone screens.

Using a static `<View>` causes clipping on shorter displays. Swifty Companion encapsulates content in a `<ScrollView>` with `contentContainerStyle`:

```javascript
<ScrollView style={styles.screen} contentContainerStyle={styles.content}>
  {/* Header Profile Section */}
  {/* Skills Section */}
  {/* Projects Section */}
</ScrollView>
```
This provides smooth native inertial scrolling on iOS and Android while maintaining padding at the bottom of the viewport.

---

## 5. Relevance to Subject Requirements

| Subject Requirement | Theoretical Concept Applied |
| :--- | :--- |
| **"Flexible or modern layout technique (layout constraints)"** | Yoga Flexbox algorithm with relative percentage dimensions and dynamic constraint properties. |
| **"Displays correctly on different screen sizes and platforms"** | Clamped percentage calculations, `SafeAreaProvider` inset handling, and `ScrollView` fluid scrolling. |
