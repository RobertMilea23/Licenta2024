import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UserEditPlayer = () => {
  const { userId } = useParams();
  const [player, setPlayer] = useState(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3005/users/${userId}`)
      .then(response => {
        const playerId = response.data.playerId;
        if (playerId) {
          axios.get(`http://localhost:3005/players/${playerId}`)
            .then(response => {
              setPlayer(response.data);
              setName(response.data.name);
              setPosition(response.data.position);
              setHeight(response.data.height);
            })
            .catch(err => {
              console.error('Error fetching player:', err);
            });
        }
      })
      .catch(err => {
        console.error('Error fetching user:', err);
      });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3005/players/${player._id}`, { name, position, height })
      .then(result => {
        setPlayer(result.data);
        alert("Player updated successfully");
      })
      .catch(err => {
        console.log(err);
        alert("Error updating player");
      });
  };

  if (!player) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Jersey NAME</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="position">Your wanted position</Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger id="position">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PG">PG-Point Guard</SelectItem>
            <SelectItem value="SG">SG-Shooting Guard</SelectItem>
            <SelectItem value="SF">SF-Small Forward</SelectItem>
            <SelectItem value="PF">PF-Power Forward</SelectItem>
            <SelectItem value="C">C-Center</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default UserEditPlayer;
