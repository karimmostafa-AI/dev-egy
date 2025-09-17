import { useState } from "react";
import { 
  Search, 
  Send,
  Paperclip,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const customers = [
  { id: 1, name: "John Doe", avatar: "", unread: 3 },
  { id: 2, name: "Jane Smith", avatar: "", unread: 0 },
  { id: 3, name: "Robert Johnson", avatar: "", unread: 1 },
  { id: 4, name: "Emily Davis", avatar: "", unread: 0 },
  { id: 5, name: "Michael Wilson", avatar: "", unread: 5 },
  { id: 6, name: "Sarah Brown", avatar: "", unread: 0 },
  { id: 7, name: "David Miller", avatar: "", unread: 2 },
];

const messages = [
  { id: 1, customerId: 1, text: "Hello, I have a question about my order #1001.", time: "10:30 AM", isOwn: false },
  { id: 2, customerId: 1, text: "Sure, how can I help you?", time: "10:32 AM", isOwn: true },
  { id: 3, customerId: 1, text: "I haven't received it yet. Can you check the status?", time: "10:35 AM", isOwn: false },
  { id: 4, customerId: 1, text: "Let me check that for you. It was shipped yesterday and should arrive by tomorrow.", time: "10:36 AM", isOwn: true },
  { id: 5, customerId: 1, text: "Thank you for the update.", time: "10:37 AM", isOwn: false },
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [newMessage, setNewMessage] = useState("");

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customerMessages = messages.filter(msg => msg.customerId === selectedCustomer.id);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    // In a real app, this would send the message to the server
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-700">
          Communicate with your customers in real-time.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Customer List */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="relative">
            <label htmlFor="search-customers" className="sr-only">
              Search customers
            </label>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
            <Input
              id="search-customers"
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-describedby="search-customers-description"
            />
            <p id="search-customers-description" className="sr-only">
              Enter customer name to search
            </p>
          </div>
          
          <div className="rounded-lg border bg-white">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="divide-y" role="listbox" aria-label="Customer list">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedCustomer.id === customer.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                    role="option"
                    aria-selected={selectedCustomer.id === customer.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedCustomer(customer);
                      }
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{customer.name}</p>
                        {customer.unread > 0 && (
                          <Badge variant="default" className="rounded-full">
                            {customer.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        Last message...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="rounded-lg border bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>View Orders</DropdownMenuItem>
                  <DropdownMenuItem>Block User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[calc(100vh-350px)] p-4">
              <div className="space-y-4" role="log" aria-live="polite">
                {customerMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn ? "text-primary-foreground/70" : "text-gray-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Attach file">
                  <Paperclip className="h-4 w-4" aria-hidden="true" />
                </Button>
                <label htmlFor="message-input" className="sr-only">
                  Type your message
                </label>
                <Input
                  id="message-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  aria-describedby="message-input-description"
                />
                <p id="message-input-description" className="sr-only">
                  Press Enter to send your message
                </p>
                <Button size="icon" onClick={handleSendMessage} aria-label="Send message">
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}