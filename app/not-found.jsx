import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Home,
  Search,
  Users,
  Calendar,
  Settings,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Search className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          It looks like this page has gone on an inter             break. Don't worry,
          we'll help you find what you're looking for!
        </p>

        {/* Quick Actions */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Where would you like to go?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col space-y-2"
                asChild
              >
                <Link href="/">
                  <Home className="h-6 w-6" />
                  <span>Home</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col space-y-2"
                asChild
              >
                <Link href="/dashboard">
                  <Calendar className="h-6 w-6" />
                  <span>Candidate Login</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Still can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you navigate HireEva and find
            exactly what you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back Home
              </Link>
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="mailto:support@bouquethiring.com">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 mt-8">
          Error Code: 404 | Page Not Found |
          <Link href="/" className="text-blue-600 hover:underline ml-1">
            Return to HireEva
          </Link>
        </p>
      </div>
    </div>
  );
}
