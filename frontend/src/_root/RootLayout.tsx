import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
    </div>
  );
};

export default RootLayout;
