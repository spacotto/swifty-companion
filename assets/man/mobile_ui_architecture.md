# Theoretical Topic: Mobile UI Paradigms & Architecture

This document explores the software engineering principles and architectural patterns governing modern mobile application development, with specific focus on how they are implemented within **Swifty Companion**.

---

## 1. Declarative vs. Imperative UI

### 1.1 The Paradigm Shift
Historically, mobile development (such as early Android with Java/XML or early iOS with Objective-C/UIKit) utilized an **imperative paradigm**. Developers manually created UI widgets and wrote sequential code to mutate their properties in response to user actions or network events:

```text
// Imperative approach (pseudo-code)
Button searchBtn = findViewById(R.id.search_btn);
searchBtn.setEnabled(false);
ProgressBar spinner = findViewById(R.id.spinner);
spinner.setVisibility(View.VISIBLE);
```

In contrast, modern mobile frameworks (React Native, SwiftUI, Flutter, Jetpack Compose) are **declarative**. The user interface is modeled as a pure mathematical function of the current application state:

$$\text{UI} = f(\text{State})$$

Instead of issuing sequential DOM/view mutations, developers declare what the screen should look like for any given state. When state changes, the framework reconciles the differences and updates the native view hierarchy efficiently.

### 1.2 Declarative Implementation in Swifty Companion
In [`src/screens/SearchScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js), the search button's appearance and interaction state are purely declared based on the `loading` boolean state:

```javascript
<TouchableOpacity 
  style={[styles.button, loading && styles.buttonDisabled]} 
  onPress={handleSearch} 
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#09090b" />
  ) : (
    <Text style={styles.buttonText}>Search</Text>
  )}
</TouchableOpacity>
```
When `setLoading(true)` is invoked, React re-evaluates the component, renders the spinner, and disables touch input automatically.

---

## 2. Component Lifecycle & Reactive State Management

### 2.1 Unidirectional Data Flow
Mobile applications maintain stability by enforcing a **unidirectional data flow**:
1. **State:** Holds mutable facts representing the current screen condition.
2. **View:** Renders visual representations of the state.
3. **Actions:** User gestures or network responses trigger state changes via dedicated mutator functions.
4. **Re-render:** State modifications trigger a reactive re-render of the relevant subtrees.

### 2.2 React Hooks in Action
* **Local State (`useState`):**  
  Used in [`SearchScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/SearchScreen.js) for `query`, `loading`, and `errorMsg`.
* **Memoized Computation (`useMemo`):**  
  Used in [`ProfileScreen.js`](file:///home/silvia/GitHub/swifty-companion/src/screens/ProfileScreen.js) to compute filtered and sorted project lists (`rootProjects`, `visibleProjects`). This avoids costly array recalculations on unrelated re-renders.

---

## 3. Screen Navigation & Stack Architecture

### 3.1 The LIFO Stack Router
Mobile navigation mimics a **Last-In, First-Out (LIFO)** stack data structure. When a user transitions between screens:
* **Push:** Navigating from Search to Profile pushes a new screen container on top of the stack. The previous screen remains suspended in memory beneath it.
* **Pop:** Navigating back removes the topmost screen, reclaiming memory and revealing the previous view without requiring re-initialization.

```
       [ ProfileScreen ]   <-- Top of Stack (Active Screen)
       -----------------
       [  SearchScreen ]   <-- Base of Stack (Preserved State)
```

### 3.2 Native Stack Acceleration
Swifty Companion uses `@react-navigation/native-stack` in [`src/navigation/AppNavigator.js`](file:///home/silvia/GitHub/swifty-companion/src/navigation/AppNavigator.js). Unlike JavaScript-simulated animations, this library leverages native platform components (`UINavigationController` on iOS and `Fragment` navigation on Android).

### 3.3 Platform Gesture Integration
* **Header Back Button:** Automatically injected into the top navigation bar.
* **Android Hardware / System Gesture:** Pops the screen stack when pressing the device's back button.
* **iOS Edge Swipe:** Allows users to swipe smoothly from the left bezel to pop the stack interactively.

---

## 4. Relevance to Subject Requirements

| Subject Requirement | Theoretical Concept Applied |
| :--- | :--- |
| **"Your app must have at least 2 views"** | Implemented as distinct stack screen nodes (`Search` and `Profile`) registered with `createNativeStackNavigator`. |
| **"Navigate back to the first view"** | Implemented via LIFO stack popping, preserving original search inputs without reloading. |
| **"Modern layout & UI techniques"** | Built using declarative component hierarchies with reactive data bindings. |
