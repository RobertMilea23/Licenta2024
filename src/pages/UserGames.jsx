import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UserGames = () => {
  const { userId } = useParams();
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [court, setCourt] = useState('');
  const [courts, setCourts] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [confirmedGames, setConfirmedGames] = useState([]);
  const [openGames, setOpenGames] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
  
    axios.get('http://localhost:3005/teams')
      .then(response => {
        setTeams(response.data);
      })
      .catch(err => {
        console.error("Error fetching teams:", err);
        toast({
          title: "Error",
          description: "Could not fetch teams.",
          variant: "destructive",
        });
      });
  
   
    let userTeam; 

    axios.get(`http://localhost:3005/teams/user/${userId}`)
      .then(response => {
        userTeam = response.data; 
        setHomeTeam(userTeam._id);
        setHomeTeamName(userTeam.name);
        setTeams(prevTeams => prevTeams.filter(team => team._id !== userTeam._id));
  
       
        return axios.get(`http://localhost:3005/games/confirmed/${userTeam._id}`);
      })
      .then(response => {
        setConfirmedGames(response.data);
  
       
        return axios.get(`http://localhost:3005/games/open/${userTeam._id}`);
      })
      .then(response => {
        setOpenGames(response.data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        toast({
          title: "Error",
          description: "Could not fetch user's team, confirmed games, or open games.",
          variant: "destructive",
        });
      });
  
    fetch('/courts.json')
      .then(response => response.json())
      .then(data => {
        setCourts(data);
      })
      .catch(err => console.error("Error fetching courts:", err));
  }, [userId, toast]);

  const fetchUnavailableTimes = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    axios.get(`http://localhost:3005/games/date/${formattedDate}`)
      .then(response => {
        setUnavailableTimes(response.data);
      })
      .catch(err => console.error("Error fetching unavailable times:", err));
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    fetchUnavailableTimes(selectedDate);
  };

  const isTimeAvailable = (time) => {
    return !unavailableTimes.some(game => {
      const gameDate = new Date(game.date);
      return gameDate.getTime() === date.getTime() && game.court === court && (game.time === time || game.time === add30Minutes(time));
    });
  };

  const add30Minutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newMinutes = minutes + 30;
    if (newMinutes >= 60) {
      return `${hours + 1}:00`;
    }
    return `${hours}:${newMinutes}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!homeTeam || !date || !time || !court) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    axios.post('http://localhost:3005/games/create', { homeTeam, awayTeam, date, time, court })
      .then(response => {
        toast({
          title: "Success",
          description: "Game created successfully.",
        });
        navigate(`/UserDashboard/${userId}/Games`);
      })
      .catch(err => {
        console.error("Error creating game:", err);
        toast({
          title: "Error",
          description: "Error creating game.",
          variant: "destructive",
        });
      });
  };

  const handleAcceptOpenGame = (gameId) => {
    axios.post('http://localhost:3005/games/accept-open', { gameId, teamId: homeTeam })
      .then(response => {
        setOpenGames(openGames.filter(game => game._id !== gameId));
        toast({
          title: "Success",
          description: "You have accepted the game.",
        });
      })
      .catch(err => {
        console.error("Error accepting open game:", err);
        toast({
          title: "Error",
          description: "Error accepting open game.",
          variant: "destructive",
        });
      });
  };

  const handleDeclineOpenGame = (gameId) => {
    axios.post('http://localhost:3005/games/decline-open', { gameId })
      .then(response => {
        setOpenGames(openGames.filter(game => game._id !== gameId));
        toast({
          title: "Success",
          description: "You have declined the game.",
        });
      })
      .catch(err => {
        console.error("Error declining open game:", err);
        toast({
          title: "Error",
          description: "Error declining open game.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Toaster />
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <span className="sr-only">Basketball Community</span>
        </nav>
      </header>

      <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <Card className="w-[600px] mb-8">
          <CardHeader>
            <CardTitle>Create a Game</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="homeTeam">Home Team</Label>
                  <input
                    id="homeTeam"
                    value={homeTeamName}
                    readOnly
                    className="form-input"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="awayTeam">Away Team</Label>
                  <Select onValueChange={setAwayTeam}>
                    <SelectTrigger id="awayTeam">
                      <SelectValue placeholder="Select Away Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams
                        .filter(team => team._id !== homeTeam) 
                        .map(team => (
                          <SelectItem key={team._id} value={team._id}>{team.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="date" variant="outline" className="w-full justify-start text-left font-normal">
                        {date ? format(date, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="time">Time</Label>
                  <Select onValueChange={setTime}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
                        <SelectItem key={time} value={time} disabled={!isTimeAvailable(time)}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="court">Court</Label>
                  <Select onValueChange={setCourt}>
                    <SelectTrigger id="court">
                      <SelectValue placeholder="Select Court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court, index) => (
                        <SelectItem key={index} value={court.name}>{court.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" type='submit'>Create Game</Button>
            </form>
          </CardContent>
        </Card>

        {/* Confirmed Games Section */}
        <Card className="w-full max-w-[600px] mb-8">
          <CardHeader>
            <CardTitle>Confirmed Games</CardTitle>
          </CardHeader>
          <CardContent>
            {confirmedGames.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Home Team</TableHead>
                    <TableHead>Away Team</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Court</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confirmedGames.map(game => (
                    <TableRow key={game._id}>
                      <TableCell>{game.homeTeam?.name || 'N/A'}</TableCell>
                      <TableCell>{game.awayTeam?.name || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(game.date), 'PPP')}</TableCell>
                      <TableCell>{game.time}</TableCell>
                      <TableCell>{game.court}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No confirmed games.</p>
            )}
          </CardContent>
        </Card>

        {/* Open Games Section */}
        <Card className="w-full max-w-[600px]">
          <CardHeader>
            <CardTitle>Open Games</CardTitle>
          </CardHeader>
          <CardContent>
            {openGames.length > 0 ? (
              openGames.map(game => (
                <div key={game._id} className="flex flex-col gap-4 mb-4 border p-4 rounded">
                  <p><strong>Home Team:</strong> {game.homeTeam?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {game.time}</p>
                  <p><strong>Court:</strong> {game.court}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAcceptOpenGame(game._id)}>Accept</Button>
                    <Button onClick={() => handleDeclineOpenGame(game._id)} variant="destructive">Decline</Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No open games.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserGames;
