import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Teams = () => {
  const [teamName, setTeamName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlayersAndTeams = async () => {
      try {
        const playersResponse = await axios.get('http://localhost:3005/players/allPlayers');
        const teamsResponse = await axios.get('http://localhost:3005/teams');

        const allPlayers = playersResponse.data;
        const teams = teamsResponse.data;

        const assignedPlayerIds = new Set();
        teams.forEach(team => {
          team.players.forEach(player => {
            assignedPlayerIds.add(player._id);
          });
        });

        const availablePlayers = allPlayers.filter(player => !assignedPlayerIds.has(player._id));
        setPlayers(availablePlayers);
        setFilteredPlayers(availablePlayers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayersAndTeams();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownVisible(true);
    if (e.target.value === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  };

  const handlePlayerSelect = (player) => {
    if (selectedPlayers.length >= 3) {
      setError('A team must have exactly 3 players.');
      return;
    }
    setError('');
    if (!selectedPlayers.some(p => p._id === player._id)) {
      setSelectedPlayers(prev => [...prev, player]);
    }
    setSearchTerm('');
    setDropdownVisible(false);
    setFilteredPlayers(players);
  };

  const handlePlayerRemove = (player) => {
    setSelectedPlayers(prev => prev.filter(p => p._id !== player._id));
    setError('');
  };

  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 100);
  };

  const handleFocus = () => {
    setDropdownVisible(true);
    setFilteredPlayers(players);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedPlayers.length !== 3) {
      setError('A team must have exactly 3 players.');
      return;
    }
    const playerIds = selectedPlayers.map(player => player._id);
    try {
      await axios.post('http://localhost:3005/teams/create', { teamName, players: playerIds });
      toast({
        title: "Team Created",
        description: `The team "${teamName}" was successfully created.`,
        status: "success",
      });
      setTimeout(() => {
        navigate('/Home');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response.data.error);
    }
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
          <Link className="text-muted-foreground transition-colors hover:text-foreground" to="/Stats">
            Stats
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
        <Card className="w-[600px] h-auto">
          <CardHeader>
            <CardTitle>Make Your Team!</CardTitle>
            <CardDescription>Customize your dream team</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex justify-between flex-col gap-8" onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team Name"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="players">Select Players</Label>
                  <div className="relative">
                    <Input
                      id="players"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Search players"
                      className="w-full"
                    />
                    {dropdownVisible && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                        {filteredPlayers.map(player => (
                          <div
                            key={player._id}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handlePlayerSelect(player)}
                          >
                            {player.name} - {player.position} - {player.height} cm
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                {selectedPlayers.map(player => (
                  <div key={player._id} className="flex items-center justify-between p-2 border border-gray-300 rounded-md mb-2">
                    <span>{player.name} - {player.position} - {player.height} cm</span>
                    <Button variant="ghost" size="sm" onClick={() => handlePlayerRemove(player)}>Remove</Button>
                  </div>
                ))}
              </div>

              {error && <div className="text-red-500">{error}</div>}
              <Button className="w-full" type='submit'>Create Team</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Teams;

// Icons Components
function ArrowUpRightIcon(props) {
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
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}


function CalendarIcon(props) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}


function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function ShoppingBasketIcon(props) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 
      6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 
      7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.000
      02V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
  )
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
  )
}


function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
