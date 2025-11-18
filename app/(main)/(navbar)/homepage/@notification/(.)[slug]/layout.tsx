interface IntNotificationLayoutProps {
  children: React.ReactNode;
}

const IntNotificationLayout = ({ children }: IntNotificationLayoutProps) => {
  return (
    <div className="overlay">
      <div className="flex-center">
        {children}
      </div>
    </div>
  );
};

export default IntNotificationLayout;
