# react-history-modals

A lightweight and type-safe React hook and context for managing modal state using the browser’s history API. It allows users to navigate through modal states using the browser’s back and forward buttons — just like navigating pages.

---

## ✨ Features

- 🧠 History-aware modals — Open/close modals push/pop history states.
- 🧩 Supports multiple modals — Stack and manage many modals at once.
- ⚛️ React-friendly API — Built with hooks and context.
- 🛡️ TypeScript support — Full typings for a better DX.
- 🚀 SSR-safe — Includes checks to avoid breaking on the server.
- 🪶 Small footprint — Tree-shakable and optimized bundle.

---

## 📦 Installation

```bash
npm install react-history-modals
# or
yarn add react-history-modals
```

---

## 🚀 Getting Started

### 1. Wrap your app with HistoryModalProvider

```tsx
import { HistoryModalProvider } from 'react-history-modals';

function App() {
  return (
    <HistoryModalProvider>
      {/* Your routes/components */}
    </HistoryModalProvider>
  );
}
```

### 2. Use the hook: useHistoryModals()

```tsx
import { useHistoryModals } from 'react-history-modals';

function CartButton() {
  const {
    openModal,
    closeModal,
    openModalChecker
  } = useHistoryModals();

  const openCart = () => {
    openModal('CartItemsBottomSheet', { cartId: 101 });
  };

  const closeCart = () => {
    closeModal('CartItemsBottomSheet');
  };

  const openCartIfInHistory = openModalChecker('CartItemsBottomSheet');
  // Example usage: openCartIfInHistory({ cartId: 123 });

  return (
    <>
      <button onClick={openCart}>Open Cart</button>
      <button onClick={closeCart}>Close Cart</button>
    </>
  );
}
```

### 3. Render modals conditionally based on history

```tsx
import { useHistoryModals } from 'react-history-modals';

function ModalRenderer() {
  const { modals, closeModal } = useHistoryModals();

  return (
    <>
      {modals.map(({ id, data }) => {
        if (id === 'CartItemsBottomSheet') {
          return (
            <CartItemsModal
              key={id}
              open={true}
              onClose={() => closeModal(id)}
              cartId={data?.cartId}
            />
          );
        }

        return null;
      })}
    </>
  );
}
```

---

## 📘 API Reference

### Provider: `<HistoryModalProvider>`

```tsx
<HistoryModalProvider>
  {children}
</HistoryModalProvider>
```

Wrap your application's root or layout component with this provider.

### Hook: `useHistoryModals()`

This hook returns an object with the following properties:

| Function / Value           | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `openModal(id, data?)`    | Opens a modal by its id and pushes a new entry to the browser history.     |
| `closeModal(id?)`         | Closes a modal. If id is provided, it closes that specific modal.          |
| `openModalChecker(id)`    | Returns a function that opens the modal only if its state exists in history.|
| `modals`                  | Array of active modals: `{ id: string, data?: any }[]`.                    |

### `openModalChecker(modalId: string): (data?: any) => void`

```tsx
const checker = openModalChecker('SomeModal');
checker({ foo: 'bar' }); // Opens only if in history
```

---

## 🧠 How It Works: Modal Management Logic

- `openModal()` pushes modal data into browser history.
- `closeModal()` triggers `history.back()`.
- Listeners on `popstate` update modal state accordingly.
- Works naturally with browser back/forward buttons.

---

## 🧪 Example: Auto-open from URL/History

```tsx
import { useEffect } from 'react';
import { useHistoryModals } from 'react-history-modals';

function ExamplePage() {
  const { openModalChecker } = useHistoryModals();

  useEffect(() => {
    const openCart = openModalChecker('CartItemsBottomSheet');
    openCart({ cartId: 123 });
  }, []);

  return <p>Example Page Content</p>;
}
```

---

## 💼 Use Cases

- Shopping cart previews with history navigation
- Multi-step wizards
- Auth/login/signup modal flows
- Deep-linked modals from URLs or page refresh
- Prevent reloads from clearing modal state

---

## ✅ SSR Compatibility

- Safe for use in SSR (e.g. Next.js)
- Skips all `window`/`history` references on the server

```tsx
// pages/_app.tsx
import { HistoryModalProvider } from 'react-history-modals';

function MyApp({ Component, pageProps }) {
  return (
    <HistoryModalProvider>
      <Component {...pageProps} />
      {/* Don't forget your central ModalRenderer component here! */}
    </HistoryModalProvider>
  );
}

export default MyApp;
```

---

## 📦 Bundle Info

- ✅ ESM-first
- ✅ Tiny footprint
- ✅ Tree-shakable
- ✅ Requires `react` and `react-dom` as peer dependencies

---

## 🙌 Contributing

Want to improve the library or report an issue? Contributions are welcome! Please feel free to open a pull request or an issue on the GitHub repository.

---

## 📄 License

MIT