import { Ticket } from "@/generated/prisma";
import Link from "next/link";
import { getPriorityClass } from "@/utils/ui";

type TicketItemProps = {
  ticket: Ticket;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
  return (
    <div
      key={ticket.id}
      className="flex justify-between items-center bg-white rounded-lg shadow border border-gray-200 p-6"
    >
      {/* Left Side */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600">
          {ticket.subject}
        </h2>
      </div>
      {/* Right Side */}
      <div className="text-right space-y-2">
        <div className="text-sm text-gray-500">
          Priority:{" "}
          <span className={getPriorityClass(ticket.priority)}>
            {ticket.priority}
          </span>
        </div>
        <Link
          href={`/tickets/${ticket.id}`}
          className="inline-block mt-2 bg-blue-600 text-white text-sm px-3 py-1 rounded
                hover:bg-blue-700 transition text-center"
        >
          View Ticket
        </Link>
      </div>
    </div>
  );
};

export default TicketItem;
