interface NotificationLayoutProps {
  children: React.ReactNode;
}

const NotificationLayout = ({ children }: NotificationLayoutProps) => {
  return (
    <div className="overlay">
      <div className="flex-center">
        {children}
      </div>
    </div>
  );
};

export default NotificationLayout;
