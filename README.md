# Getting Started with Envelope React App

## Download dependencies

##### For any other project using [react-envelope](https://github.com/aexra/react-envelope)
```bash
npm i react-router-dom axios react-hot-toast
```

##### For this repo
```bash
npm i
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