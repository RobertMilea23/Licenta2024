import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const UserEditPlayer = () => {
  const { userId } = useParams();
  const [player, setPlayer] = useState(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3005/players/user/${userId}`)
      .then(response => {
        setPlayer(response.data);
        setName(response.data.name);
        setPosition(response.data.position);
        setHeight(response.data.height);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setPlayer(null);
        } else {
          setError(err);
        }
      });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:3005/players/createOrUpdate', { userId, name, position, height })
      .then(response => {
        setPlayer(response.data);
      })
      .catch(err => {
        setError(err);
      });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{player ? 'Edit Player' : 'Create Player'}</CardTitle>
          <CardDescription>{player ? 'Edit your player details' : 'Create a new player'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PG">PG - Point Guard</SelectItem>
                  <SelectItem value="SG">SG - Shooting Guard</SelectItem>
                  <SelectItem value="SF">SF - Small Forward</SelectItem>
                  <SelectItem value="PF">PF - Power Forward</SelectItem>
                  <SelectItem value="C">C - Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" />
            </div>
            <Button type="submit" className="w-full">{player ? 'Update Player' : 'Create Player'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserEditPlayer;
