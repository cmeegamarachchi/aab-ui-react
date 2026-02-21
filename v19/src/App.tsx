import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./features/home";
import { ErrorPage, Site404Page } from "./features/core";
import { ContactsPage } from "./features/contacts";
import { SettingsPage } from "./features/settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/contacts",
    element: <ContactsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/contacts/all",
    element: <ContactsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <Site404Page />,
  },
]);


function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}
 
export default App