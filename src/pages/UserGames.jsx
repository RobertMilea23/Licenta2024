import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const UserGames = () => {
  const { userId } = useParams();
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [court, setCourt] = useState('');
  const [courts, setCourts] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3005/teams')
      .then(response => {
        setTeams(response.data);
      })
      .catch(err => console.error(err));

    fetch('/courts.json')
      .then(response => response.json())
      .then(data => {
        setCourts(data);
      })
      .catch(err => console.error(err));
  }, []);

  const fetchUnavailableTimes = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    axios.get(`http://localhost:3005/games/date/${formattedDate}`)
      .then(response => {
        setUnavailableTimes(response.data);
      })
      .catch(err => console.error(err));
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
    if (!homeTeam || !awayTeam || !date || !time || !court) {
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
        console.error(err);
        toast({
          title: "Error",
          description: "Error creating game.",
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

      <div className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <Card className="w-[600px] h-auto">
          <CardHeader>
            <CardTitle>Create a Game</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="homeTeam">Home Team</Label>
                  <Select onValueChange={setHomeTeam}>
                    <SelectTrigger id="homeTeam">
                      <SelectValue placeholder="Select Home Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team._id} value={team._id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="awayTeam">Away Team</Label>
                  <Select onValueChange={setAwayTeam}>
                    <SelectTrigger id="awayTeam">
                      <SelectValue placeholder="Select Away Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
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
      </div>
    </div>
  );
}

export default UserGames;
