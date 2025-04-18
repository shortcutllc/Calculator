# Shortcut Design System

## Color Palette
```css
:root {
    --primary-color: #FF5050;       /* Red */
    --secondary-color: #003C5E;     /* Deep Blue */
    --accent-color-1: #FFEB69;      /* Yellow */
    --accent-color-2: #9EFAFF;      /* Light Blue/Teal */
    --accent-color-3: #F9CDFF;      /* Light Purple */
    --light-gray: #f5f5f5;
    --medium-gray: #e0e0e0;
    --dark-gray: #333333;
    --white: #ffffff;
}
```

## Typography
- Font Family: 'Outfit', sans-serif
- Base Line Height: 1.6
- Base Text Color: var(--secondary-color)

## Spacing & Layout
- Container Max Width: 1200px
- Base Padding: 20px
- Grid Gap: 20px
- Border Radius: 24px

## Components

### Buttons
```css
.btn {
    padding: 15px 30px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.btn-primary {
    background-color: var(--primary-color);
    color: var(--white);
}

.btn-secondary {
    background-color: var(--accent-color-2);
    color: var(--secondary-color);
}

.btn-accent {
    background-color: var(--accent-color-1);
    color: var(--secondary-color);
}
```

### Forms
```css
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: var(--secondary-color);
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--medium-gray);
    border-radius: var(--border-radius);
    font-size: 16px;
    font-family: 'Outfit', sans-serif;
}
```

### Cards
```css
.card {
    background-color: var(--white);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
}
```

## Responsive Design
```css
@media (max-width: 768px) {
    .calculator-container {
        grid-template-columns: 1fr;
    }
}
```

## Usage Notes
1. All components use CSS variables for consistent theming
2. Hover states include subtle animations and shadow changes
3. Forms use consistent spacing and styling
4. Cards provide visual hierarchy with shadows and rounded corners
5. The design system is mobile-first with responsive breakpoints

## Implementation
To use this design system in your project:

1. Copy the CSS variables from the `:root` section
2. Import the Outfit font family
3. Apply the component classes to your HTML elements
4. Customize the variables as needed for your specific implementation 