import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';

const UserTeams = () => {
  const [teamName, setTeamName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch user-created players
    axios.get('http://localhost:3005/players/user-players')
      .then(response => setPlayers(response.data))
      .catch(err => console.error('Error fetching players:', err));

    // Fetch invitations for the user
    axios.get(`http://localhost:3005/invitations/${userId}`)
      .then(response => setInvitations(response.data))
      .catch(err => console.error('Error fetching invitations:', err));
  }, [userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInvite = (player) => {
    if (invitedPlayers.length < 2) {
      setInvitedPlayers([...invitedPlayers, player]);
    }
  };

  const handleRemoveInvite = (playerId) => {
    setInvitedPlayers(invitedPlayers.filter(player => player._id !== playerId));
  };

  const handleSendInvitations = () => {
    axios.post('http://localhost:3005/teams/send-invitations', {
      teamName,
      ownerId: userId,
      playerIds: invitedPlayers.map(player => player.userId) // Ensure correct userId is sent
    })
      .then(response => {
        console.log(response.data.message);
        // Reset form
        setTeamName('');
        setInvitedPlayers([]);
      })
      .catch(err => console.error('Error sending invitations:', err));
  };

  const handleInvitationResponse = (invitationId, response) => {
    axios.post('http://localhost:3005/invitations/respond', { invitationId, response })
      .then(response => {
        setInvitations(prevInvitations =>
          prevInvitations.map(invitation =>
            invitation._id === invitationId ? { ...invitation, status: response.data.status } : invitation
          )
        );
      })
      .catch(err => console.error('Error responding to invitation:', err));
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Send Team Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="teamName">Team Name</Label>
              <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter team name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="search">Search Players</Label>
              <Input id="search" value={searchTerm} onChange={handleSearch} placeholder="Search for players to invite" />
            </div>
            <div>
              <h3>Available Players</h3>
              {filteredPlayers.map(player => (
                <div key={player._id} className="flex justify-between items-center p-2 border-b">
                  <span>{player.name}</span>
                  <Button onClick={() => handleInvite(player)} disabled={invitedPlayers.includes(player)}>
                    Invite
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <h3>Invited Players</h3>
              {invitedPlayers.map(player => (
                <div key={player._id} className="flex justify-between items-center p-2 border-b">
                  <span>{player.name}</span>
                  <Button variant="destructive" onClick={() => handleRemoveInvite(player._id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendInvitations} disabled={!teamName || invitedPlayers.length === 0}>
            Send Invitations
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-8 w-[600px]">
        <h2>Invitations</h2>
        <ul>
          {invitations.map(invitation => (
            <li key={invitation._id} className="flex justify-between items-center p-2 border-b">
              <span>{invitation.sender.email} invited you to join {invitation.team.name}</span>
              {invitation.status === 'pending' ? (
                <div>
                  <Button onClick={() => handleInvitationResponse(invitation._id, 'accepted')}>Accept</Button>
                  <Button variant="destructive" onClick={() => handleInvitationResponse(invitation._id, 'rejected')}>Deny</Button>
                </div>
              ) : (
                <span>{invitation.status}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserTeams;

