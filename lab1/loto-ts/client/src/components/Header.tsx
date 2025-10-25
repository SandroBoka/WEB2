import type { SessionResponse } from "../api";

type Tab = "home" | "pay";

export default function Header(props: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  session: SessionResponse | null;
  canPay: boolean;
}) {
  const isAuth = !!props.session?.isAuthenticated;
  const user = props.session?.user || undefined;

  return (
    <header className="container">
      <nav className="navbar" aria-label="Main">
        <strong>Loto 6/45</strong>

        <button
          role="tab"
          aria-selected={props.tab === "home"}
          onClick={() => props.onTabChange("home")}
        >
          Home
        </button>

        <button
          role="tab"
          aria-selected={props.tab === "pay"}
          onClick={() => props.onTabChange("pay")}
          disabled={!props.canPay}
          title={props.canPay ? "Buy a ticket" : "To buy a ticket you need to be logged in and current round has to be active."}
        >
          Buy a ticket
        </button>

        <span className="nav-spacer" />

        {isAuth ? (
          <>
            {user?.picture && (
              <img
                src={user.picture as string}
                alt="avatar"
                width={28}
                height={28}
                style={{ borderRadius: "50%" }}
              />
            )}
            <span className="badge">{user?.name || user?.email}</span>
            <a role="button" href="/logout">Logout</a>
          </>
        ) : (
          <a role="button" href="/login">Login</a>
        )}
      </nav>
      <hr />
    </header>
  );
}
