import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";

const Players = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [height, setHeight] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3005/players/Players', { name, position, height })
      .then(result => {
        console.log(result);
        navigate('/Home');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" to="#">
            <ShoppingBasketIcon className="h-6 w-6" />
            <span className="sr-only">Basketball Community</span>
          </Link>
          <Link className="text-foreground transition-colors hover:text-foreground" to="/Home">
            Dashboard
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to="/Games">
            Games
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to='/Teams'>
            Teams
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to="/Players">
            Players
          </Link>
        
        </nav>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              {/* <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search teams, players, games..."
                type="search"
              /> */}
            </div>
          </form>

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

      <div className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <Card className="w-[600px] h-[550px]">
          <CardHeader>
            <CardTitle>Choose your playstyle!</CardTitle>
            <CardDescription>Decide what you want to be on the court</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex justify-between flex-col gap-8" onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Jersey NAME</Label>
                  <Input id="name" placeholder="Name on your jersey" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="position">Your wanted position</Label>
                  <Select onValueChange={(selectedValue) => setPosition(selectedValue)}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="PG">PG-Point Guard</SelectItem>
                      <SelectItem value="SG">SG-Shooting Guard</SelectItem>
                      <SelectItem value="SF">SF-Small Forward</SelectItem>
                      <SelectItem value="PF">PF-Power Forward</SelectItem>
                      <SelectItem value="C">C-Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" placeholder="Your height" onChange={(e) => setHeight(e.target.value)} />
                </div>
              </div>
              <Button className="w-1/4" type='submit'>GO!</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Players;

function ShoppingBasketIcon(props) {
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
