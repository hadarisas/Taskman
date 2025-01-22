import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Header from "../components/layout/Header";
import Card from "../components/common/Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate, isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dashboard Content
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Dashboard content will go here...
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
