import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
            <ShoppingBasketIcon className="h-6 w-6" />
            <span className="sr-only">Basketball Community</span>
          </Link>
          <Link className="text-foreground transition-colors hover:text-foreground" to="/Home">
            Dashboard
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground"  to="/Games">
            Games
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" href="#">
            Teams
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" href="#">
            Players
          </Link>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" href="#">
            Stats
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="shrink-0 md:hidden" size="icon" variant="outline">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
                <ShoppingBasketIcon className="h-6 w-6" />
                <span className="sr-only">Basketball Community</span>
              </Link>
              <Link className="hover:text-foreground" href="#">
                Dashboard
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Games
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Teams
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Players
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Stats
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search teams, players, games..."
                type="search"
              />
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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">Total teams</p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Players</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">512</div>
              <p className="text-xs text-muted-foreground">Total players</p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,573</div>
              <p className="text-xs text-muted-foreground">Total attendance</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Upcoming Games</CardTitle>
                <CardDescription>Upcoming games for the next 7 days.</CardDescription>
              </div>
              <Button asChild className="ml-auto gap-1" size="sm">
                <Link href="#">
                  View All
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Home Team</TableHead>
                    <TableHead>Away Team</TableHead>
                    <TableHead className="hidden xl:table-column">Date</TableHead>
                    <TableHead className="hidden xl:table-column">Time</TableHead>
                    <TableHead className="text-right">Venue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Lakers</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Warriors</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">2023-06-23</TableCell>
                    <TableCell className="hidden xl:table-column">7:00 PM</TableCell>
                    <TableCell className="text-right">Staples Center</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Celtics</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Knicks</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">2023-06-24</TableCell>
                    <TableCell className="hidden xl:table-column">8:00 PM</TableCell>
                    <TableCell className="text-right">Madison Square Garden</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Bucks</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Raptors</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">2023-06-25</TableCell>
                    <TableCell className="hidden xl:table-column">6:00 PM</TableCell>
                    <TableCell className="text-right">Fiserv Forum</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Mavericks</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Suns</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">2023-06-26</TableCell>
                    <TableCell className="hidden xl:table-column">9:00 PM</TableCell>
                    <TableCell className="text-right">American Airlines Center</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Heat</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Rotaru</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">2023-06-27</TableCell>
                    <TableCell className="hidden xl:table-column">7:30 PM</TableCell>
                    <TableCell className="text-right">FTX Arena</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Lakers 120 - Warriors 110</p>
                  <p className="text-sm text-muted-foreground">2023-06-22</p>
                </div>
                <div className="ml-auto font-medium">Staples Center</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Celtics 105 - Knicks 95</p>
                  <p className="text-sm text-muted-foreground">2023-06-21</p>
                </div>
                <div className="ml-auto font-medium">Madison Square Garden</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Bucks 115 - Raptors 105</p>
                  <p className="text-sm text-muted-foreground">2023-06-20</p>
                </div>
                <div className="ml-auto font-medium">Fiserv Forum</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Mavericks 108 - Suns 103</p>
                  <p className="text-sm text-muted-foreground">2023-06-19</p>
                </div>
                <div className="ml-auto font-medium">American Airlines Center</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Heat 102 - Nets 98</p>
                  <p className="text-sm text-muted-foreground">2023-06-18</p>
                </div>
                <div className="ml-auto font-medium">FTX Arena</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* <Card x-chunk="dashboard-01-chunk-6">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Create a Team</CardTitle>
                <CardDescription>Add a new team to the community.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input id="team-name" placeholder="Enter team name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team-description">Team Description</Label>
                  <Textarea id="team-description" placeholder="Enter team description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team-players">Players</Label>
                  <Select id="team-players" multiple>
                    <SelectTrigger>
                      <SelectValue placeholder="Select players" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Players</SelectLabel>
                        <SelectItem value="player1">Player 1</SelectItem>
                        <SelectItem value="player2">Player 2</SelectItem>
                        <SelectItem value="player3">Player 3</SelectItem>
                        <SelectItem value="player4">Player 4</SelectItem>
                        <SelectItem value="player5">Player 5</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" type="submit">
                  Create Team
                </Button>
              </form>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  )
}

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
      02V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
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