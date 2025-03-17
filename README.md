# Getting Started with Envelope React App

## Clone repository

```bash
git clone https://github.com/aexra/react-envelope-base.git
cd react-envelope-base
git submodule init
git submodule update
npm i
```

## Download dependencies

##### For any other project using [react-envelope](https://github.com/aexra/react-envelope)
```bash
npm i react-router-dom axios react-hot-toast react-markdown parse-numeric-range remark-gfm remark-math rehype-raw rehype-katex rehype-highlight highlight.js
```

##### For this repo
```bash
npm i --force
```

## Using toasts
##### We use [react-hot-toast](https://react-hot-toast.com/)

### Getting started
Add the Toaster to your app first. It will take care of rendering all notifications emitted. Now you can trigger toast() from anywhere!

```jsx
import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};
```

> [!TIP]
> ```jsx
> toast(msg: string, opts: ToastOptions);
> type ToastOptions = Partial<Pick<Toast, 
>     'id' | 
>     'icon' | 
>     'duration' | 
>     'ariaProps' | 
>     'className' | 
>     'style' | 
>     'position' | 
>     'iconTheme' | 
>     'removeDelay'>
>>;
> ```

> [!TIP]
> Also you can use prefabed toasts like:
> ```jsx
> declare const toast: {
>    (message: Message, opts?: ToastOptions): string;
>    error: ToastHandler;
>    success: ToastHandler;
>    loading: ToastHandler;
>    custom: ToastHandler;
>    dismiss(toastId?: string): void;
>    remove(toastId?: string): void;
>    promise<T>(promise: Promise<T> | (() => Promise<T>), msgs: {
>        loading: Renderable;
>        success?: ValueOrFunction<Renderable, T>;
>        error?: ValueOrFunction<Renderable, any>;
>    }, opts?: DefaultToastOptions): Promise<T>;
>};
> ```

## Using routing

### Getting started
First create `Router` component like so:
```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SamplesPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};
```

Then use it in your `App` component alongside `Toaster` component:

```jsx
import './App.css';
import { Router } from './components/utils/Router';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster/>
      <Router/>
    </>
  );
}

export default App;

```
