import React, { useState } from "react";
import { Users, Plus, Check, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { toast } from "react-toastify";
import "./ForumGuildRegistry.scss";

const initialGuilds = [
  { id: 1, name: "Theory Crafters", icon: "🧠", desc: "Debate lore cliffhangers & easter eggs.", members: 1420, joined: false },
  { id: 2, name: "Artisan Guild", icon: "🎨", desc: "Share character sketches, fan art & design tips.", members: 890, joined: false },
  { id: 3, name: "Manga Alliance", icon: "🎌", desc: "Discuss classic manga paneling & screen tones.", members: 950, joined: false },
  { id: 4, name: "Giveaways Club", icon: "🎁", desc: "Claim physical prints & collector drops.", members: 2150, joined: false }
];

const ForumGuildRegistry = () => {
  const [guilds, setGuilds] = useState(initialGuilds);
  const [isOpen, setIsOpen] = useState(false);

  const toggleJoin = (guildId, guildName, isJoined, e) => {
    e.stopPropagation();
    setGuilds(prev => prev.map(g => {
      if (g.id === guildId) {
        if (!isJoined) {
          toast.success(`🎉 You joined the "${guildName}" Guild! +15 XP rewarded.`);
          return { ...g, joined: true, members: g.members + 1 };
        } else {
          toast.info(`You left the "${guildName}" Guild.`);
          return { ...g, joined: false, members: g.members - 1 };
        }
      }
      return g;
    }));
  };

  return (
    <div className={`forum-guild-registry ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="registry-bar-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-title-side">
          <Shield size={16} className="guild-shield-icon" />
          <span className="registry-title">Explore Featured Guilds</span>
          <span className="guild-count-badge">{guilds.length} Guilds</span>
        </div>

        <button className="toggle-collapse-btn" aria-label="Toggle Guilds">
          <span className="toggle-label">{isOpen ? "Hide Guilds" : "View Guilds"}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isOpen && (
        <div className="guilds-grid">
          {guilds.map((guild) => (
            <div key={guild.id} className={`guild-card ${guild.joined ? "joined" : ""}`}>
              <div className="guild-icon">{guild.icon}</div>
              <h4 className="guild-name">{guild.name}</h4>
              <p className="guild-desc">{guild.desc}</p>
              
              <div className="guild-meta-row">
                <div className="guild-members">
                  <Users size={13} strokeWidth={2} /> <span>{guild.members}</span>
                </div>
                <button 
                  className={`join-guild-btn ${guild.joined ? "active" : ""}`}
                  onClick={(e) => toggleJoin(guild.id, guild.name, guild.joined, e)}
                >
                  {guild.joined ? (
                    <><Check size={12} strokeWidth={2.5} /> Joined</>
                  ) : (
                    <><Plus size={12} strokeWidth={2.5} /> Join</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumGuildRegistry;
