import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';

const UserTeams = () => {
  const { userId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3005/players/user-players')
      .then(response => setPlayers(response.data))
      .catch(err => console.error('Error fetching players:', err));

    axios.get(`http://localhost:3005/invitations/${userId}`)
      .then(response => setInvitations(response.data))
      .catch(err => console.error('Error fetching invitations:', err));

    axios.get(`http://localhost:3005/teams/user/${userId}`)
      .then(response => setTeam(response.data))
      .catch(err => {
        if (err.response && err.response.status !== 404) {
          console.error('Error fetching team:', err);
        }
      });
  }, [userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInvite = (player) => {
    setInvitedPlayers([...invitedPlayers, player]);
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
        setTeam(response.data.team);
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

        if (response === 'accepted') {
          axios.get(`http://localhost:3005/teams/user/${userId}`)
            .then(response => setTeam(response.data))
            .catch(err => console.error('Error fetching team:', err));
        }
      })
      .catch(err => {
        console.error('Error responding to invitation:', err);
        alert(`Error responding to invitation: ${err.response?.data?.error || err.message}`);
      });
  };

  const handleLeaveTeam = () => {
    axios.post('http://localhost:3005/teams/leave-team', { userId })
      .then(response => {
        console.log(response.data.message);
        setTeam(null);
      })
      .catch(err => console.error('Error leaving team:', err));
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(player => !team || !team.players.some(p => p._id === player._id));

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
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                disabled={!!team} // Disable if team is created
              />
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
                  <Button onClick={() => handleInvite(player)} disabled={invitedPlayers.includes(player) || !!team}>
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
          <Button onClick={handleSendInvitations} disabled={!teamName || invitedPlayers.length === 0 || !!team}>
            Send Invitations
          </Button>
        </CardFooter>
      </Card>
      {team && (
        <div className="mt-8 w-[600px]">
          <h2>Your Team</h2>
          <p>Team Name: {team.name}</p>
          <p>Team Owner: {team.owner.email}</p>
          <h3>Players</h3>
          <ul>
            {team.players.map(player => (
              <li key={player._id}>{player.email}</li>
            ))}
          </ul>
          <Button variant="destructive" onClick={handleLeaveTeam}>Leave Team</Button>
        </div>
      )}
      <div className="mt-8 w-[600px]">
        <h2>Invitations</h2>
        <ul>
          {invitations.map(invitation => (
            <li key={invitation._id} className="flex justify-between items-center p-2 border-b">
              <span>{invitation.sender?.email || 'Unknown'} invited you to join {invitation.team?.name || 'Unknown'}</span>
              {invitation.status === 'pending' ? (
                <div>
                  <Button onClick={() => handleInvitationResponse(invitation._id, 'accepted')}>Accept</Button>
                  <Button variant="destructive" onClick={() => handleInvitationResponse(invitation._id, 'rejected')}>Deny</Button>
                </div>
              ) : (
                <span>{invitation.status ? invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1) : 'N/A'}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserTeams;
