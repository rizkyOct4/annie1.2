import Dashboard from "./nav-dashboard";
import CreatorContext from "./data/context";

const layout = ({
  children,
  model,
}: {
  children: React.ReactNode;
  model: React.ReactNode;
}) => {
  return (
    <CreatorContext>
      <Dashboard />
      {children}
      {model}
    </CreatorContext>
  );
};

export default layout;
