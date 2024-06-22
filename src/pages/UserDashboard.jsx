import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, Outlet } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const UserDashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    axios.get(`http://localhost:3005/users/${userId}`)
      .then(response => {
        setUser(response.data);
        return axios.get(`http://localhost:3005/teams/user/${userId}`);
      })
      .then(response => {
        setTeam(response.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        toast({
          title: 'Error fetching data',
          description: 'There was an error fetching the data. Please try again later.',
          variant: 'destructive',
        });
      });
  }, [userId, toast]);

  const leaveTeam = () => {
    axios.post('http://localhost:3005/teams/leave-team', { userId })
      .then(() => {
        setTeam(null);
        toast({
          title: "Success",
          description: "You have left the team.",
        });
      })
      .catch(err => {
        console.error("Error leaving team:", err);
        toast({
          title: "Error",
          description: `Error leaving team.`,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" to="#">
            <span className="sr-only">Basketball Community</span>
          </Link>
          <Link className="text-foreground transition-colors hover:text-foreground" to={`/UserDashboard/${userId}`}>
            Dashboard
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to={`/UserDashboard/${userId}/Games`}>
            Games
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to={`/UserDashboard/${userId}/Teams`}>
            Teams
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to={`/UserDashboard/${userId}/EditPlayer`}>
            Player
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to={`/UserDashboard/${userId}/Stats`}>
            Stats
          </Link>
        </nav>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="secondary">
                <UserCircleIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.email}</CardTitle>
            <CardDescription>Your personalized dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Display the user's team */}
            {team ? (
              <div className="mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Team: {team.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Team Owner:</strong> {team.owner.email}</p>
                    <p><strong>Players:</strong> {team.players.map(player => player.email).join(', ')}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={leaveTeam} variant="destructive">Leave Team</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <p>You are not part of a team.</p>
            )}

            {/* The Outlet renders the matched child route */}
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;

function UserCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}
