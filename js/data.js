// Everything the page lists lives here, so updating a version or a price is a one-line change.
// Numbers checked against the Asset Store on 2026-10-20.

const STORE = id => `https://assetstore.unity.com/packages/slug/${id}`;
const YT = id => `https://www.youtube.com/watch?v=${id}`;

window.ROADBOOK = [
  {
    group: "Driving physics",
    note: "Making a box with four wheels feel alive.",
    tools: [
      {
        id: 243624, name: "Sim-Cade Vehicle Physics", price: "$45", rating: [5.0, 14],
        version: "1.8", updated: "2026-03-23", first: "2023-02-20",
        unity: "2020.3 → 6000.3", thumb: "sim-cade-vehicle-physics",
        line: "The middle ground: weight transfer and real grip curves, but forgiving enough for NFS-style street racing.",
        specs: ["Quick setup tool", "Tunable friction curves and suspension", "Full source code", "Cinemachine 3 support"],
        video: YT("dYsYvbi54qI"), demo: "https://drive.google.com/drive/folders/1V8UphpM-AxjDIWBkJI24q-Rj5m9ReCCO",
        call: ["R", 4, "long"]
      },
      {
        id: 187803, name: "Ash Vehicle Physics", price: "$25", rating: [5.0, 37],
        version: "3.4", updated: "2026-03-23", first: "2021-02-11",
        unity: "2020.3 → 6000.3", thumb: "ash-vehicle-physics",
        line: "The first one, and still the most reviewed. Arcade handling with suspension and friction you can actually tune.",
        specs: ["No coding required", "New Input System", "Suspension, friction, braking, steering curves", "Runs on mobile"],
        video: YT("NaBnvrg4kac"), demo: "https://drive.google.com/drive/u/0/folders/1aDwXXz2yurEfukDnXidiHKbrXAQ4i4Hi",
        call: ["L", 3, "tightens"]
      },
      {
        id: 193251, name: "Arcade Vehicle Physics", price: "$5", rating: [5.0, 48],
        version: "1.5", updated: "2026-03-23", first: "2022-02-15",
        unity: "2020.3 → 6000.0", thumb: "arcade-vehicle-physics",
        line: "Sphere-based arcade driving. Two clicks to set up, five dollars, and the most favourited thing I've made.",
        specs: ["Two-button setup", "Sphere-based movement", "New Input System", "Cinemachine 3 support"],
        video: YT("GdYdEMmP_mE"), demo: "https://drive.google.com/drive/folders/1YhrUnolFkr4FlAoTyjk6jcYissBMMzOM",
        call: ["R", 5, ""]
      },
      {
        id: 288782, name: "Arcade Bike Physics Pro", price: "$50", rating: [5.0, 4],
        version: "1.6", updated: "2026-08-06", first: "2024-07-24",
        unity: "2022.3 → 6000.3", thumb: null,
        line: "Bikes are harder than cars. A procedural IK rider, ragdoll falls, gears and a bike builder.",
        specs: ["Bike Creator tool", "Procedural IK/FK rider", "Ragdoll setup tool", "Speed-based FOV and camera shake", "Mobile controls"],
        video: YT("0ZwFL9mx0-A"), demo: "https://ash-dev.itch.io/arcade-bike-physics-pro-demo", demoLabel: "Play in browser",
        call: ["L", 2, "don't cut"]
      },
      {
        id: 224528, name: "Arcade Bike Physics", price: "$10", rating: [5.0, 9],
        version: "1.0", updated: "2025-01-09", first: "2022-06-14",
        unity: "2020.3 → 6000.0", thumb: "arcade-bike-physics",
        line: "The original bike controller, with an IK rider that leans into the corner with you.",
        specs: ["IK rider animation", "Arcade bike handling", "Cinemachine camera"],
        video: YT("3SEM8gjb-ck"), demo: "https://drive.google.com/drive/folders/1Bp0Dl6AR19-pAjnKJw82yFE1YBLVeDl_",
        call: ["R", 6, ""]
      },
      {
        id: 216544, name: "Ash Monster Truck Physics", price: "$50", rating: [4.0, 8],
        version: "1.3", updated: "2026-03-23", first: "2022-03-24",
        unity: "2020.3 → 6000.3", thumb: "ash-monster-truck-physics",
        line: "Long-travel suspension, huge tyres, and fifteen trucks to bounce around with.",
        specs: ["Long-travel suspension", "Includes 15 monster truck models", "Cinemachine 3 support"],
        video: YT("0RfpOohmJP0"), demo: "https://drive.google.com/drive/folders/1D84Lld69Uf0srIjw7psLSa6oEBUMXYS9",
        call: ["L", 4, "over crest"]
      },
      {
        id: 311903, name: "Arcade Damage System", price: "$5", rating: null,
        version: "1.0", updated: "2025-02-24", first: "2025-02-22",
        unity: "2022.3+", thumb: null,
        line: "Real-time dents. Collisions deform the mesh, using the Job System and Burst.",
        specs: ["Job System + Burst", "Optional mesh-collider sync", "Works with any controller"],
        video: YT("-9XoD3SnjpU"),
        call: ["R", 3, ""]
      }
    ]
  },
  {
    group: "Traffic and opponents",
    note: "Something to race against.",
    tools: [
      {
        id: 298299, name: "Omni Vehicle AI", price: "$60", rating: null,
        version: "1.5", updated: "2025-06-13", first: "2024-11-07",
        unity: "2022.3+", thumb: null,
        line: "Turns any vehicle controller into an AI driver: Edy's, NWH, RCC, FGear, UVC and mine.",
        specs: ["Waypoint and spline paths", "Context-based avoidance and overtaking", "Brakes before corners, reverses when stuck", "Ready-made integrations"],
        video: YT("GNUIgrahwuU"),
        call: ["L", 5, "into"]
      },
      {
        id: 200028, name: "Ash Vehicle AI", price: "$25", rating: [5.0, 18],
        version: "3.0", updated: "2024-11-06", first: "2021-09-10",
        unity: "2020.3 → 6000.0", thumb: "ash-vehicle-ai",
        line: "Path-following and chase AI, with a waypoint painter so you draw the racing line instead of placing points.",
        specs: ["Path follow and target follow", "Obstacle avoidance", "Waypoint painter tool"],
        video: YT("a3eXc0DcJ_U"),
        call: ["R", 2, ""]
      },
      {
        id: 220740, name: "Arcade Vehicle AI", price: "$5", rating: [5.0, 10],
        version: "1.0", updated: "2024-11-06", first: "2022-05-06",
        unity: "2020.3 → 6000.0", thumb: "arcade-vehicle-ai",
        line: "Opponents for Arcade Vehicle Physics.",
        specs: ["Path follow", "Target follow"],
        video: YT("ctYtb-kAd1U"),
        call: ["L", 6, ""]
      }
    ]
  },
  {
    group: "Cameras",
    note: "Half of how fast a car feels is the camera.",
    tools: [
      {
        id: 373986, name: "VehiCam", price: "$50", rating: null,
        version: "1.0", updated: "2026-04-25", first: "2026-04-25",
        unity: "6000.3, URP", thumb: null,
        line: "A modular vehicle camera kit: speed lines, drift lean, impact shake, cockpit view, rain on the lens.",
        specs: ["20+ camera effects", "Cinemachine based", "URP screen and weather effects"],
        video: YT("ZQW6gcNrZ5A"),
        call: ["R", 4, "opens"]
      }
    ]
  },
  {
    group: "Animation",
    note: "",
    tools: [
      {
        id: 331155, name: "Control Rig Pro", price: "$20", rating: null,
        version: "1.0", updated: "2025-09-02", first: "2025-09-02",
        unity: "6000.0+", thumb: null,
        line: "Finds the bone chains on humanoids and creatures and builds an Animation Rigging setup for you.",
        specs: ["Auto-detects bone chains", "Creatures and humanoids", "Animation Rigging constraints"],
        video: YT("0LaoOX0DZPM"),
        call: ["L", 3, ""]
      },
      {
        id: 249848, name: "Control Rig", price: "Free", rating: [5.0, 14],
        version: "1.0", updated: "2023-10-06", first: "2023-07-12",
        unity: "2021.3+", thumb: "control-rig",
        line: "One click to add IK control points to a humanoid rig. Open source on GitHub, too.",
        specs: ["One-click humanoid rig", "Animation Rigging package"],
        video: YT("ok9TPcgqXSQ"), source: "https://github.com/ashdev18/Control-Rig",
        call: ["R", 5, ""]
      }
    ]
  },
  {
    group: "Editor tools",
    note: "Things I built for myself first.",
    tools: [
      {
        id: 329077, name: "Focus – Task Manager", price: null, rating: null,
        version: "1.8", updated: null, first: "2025-08-11",
        unity: "Editor only", thumb: null,
        line: "A Kanban board inside the Unity Editor. Ctrl+F12 to capture a bug without leaving the scene.",
        specs: ["Boards inside the Editor", "Attach assets to cards", "Filters, presets, 50-step undo"],
        video: YT("NrIpuxlO4Ow"),
        call: ["L", 4, ""]
      },
      {
        id: 264811, name: "Input Switch", price: "Free", rating: null,
        version: "1.2", updated: "2025-03-19", first: "2023-10-31",
        unity: "2022.3", thumb: null,
        line: "Moves a project from the old Input Manager to the new Input System in one click. Free since Unity 6 made the switch the default.",
        specs: ["One-click migration", "No longer updated"],
        video: YT("DGEvVPayo5c"),
        call: ["R", 6, ""]
      },
      {
        id: 271556, name: "Script Preset Creator", price: "Free", rating: null,
        version: "1.0", updated: "2025-02-20", first: "2025-02-19",
        unity: "2022.3+", thumb: null,
        line: "Saves any MonoBehaviour's settings as a ScriptableObject preset.",
        specs: ["Works on any component", "No dependencies"],
        video: YT("CLGGYNVK1MM"),
        call: ["L", 5, ""]
      }
    ]
  },
  {
    group: "3D models",
    note: "",
    tools: [
      {
        id: 215152, name: "Rally Cars", price: "Free", rating: [4.0, 6],
        version: "1.0", updated: "2023-06-05", first: "2022-03-04",
        unity: "2020.3+", thumb: "rally-cars",
        line: "Twenty low-poly rally cars in works liveries.",
        specs: ["20 cars"],
        call: ["R", 3, ""]
      },
      {
        id: 215221, name: "Arcade Monster Trucks", price: "$15", rating: null,
        version: "1.0", updated: "2022-04-19", first: "2022-04-01",
        unity: "2020.3+", thumb: "arcade-monster-trucks",
        line: "Fifteen cartoon monster trucks. Included free with Ash Monster Truck Physics.",
        specs: ["15 trucks"],
        video: YT("QEs5Gv9OED0"),
        call: ["L", 2, "finish"]
      }
    ]
  }
].map(g => ({ ...g, tools: g.tools.map(t => ({ ...t, store: STORE(t.id) })) }));

// The timing sheet: one row per thing that shipped.
window.TIMING = [
  ["2017-05", "YouTube channel starts", "youtube.com/@ashdev"],
  ["2021-02", "Ash Vehicle Physics", "First Asset Store release"],
  ["2021-09", "Ash Vehicle AI", ""],
  ["2022-02", "Arcade Vehicle Physics", "Becomes the most favourited"],
  ["2022-03", "Rally Cars · Monster Truck Physics", ""],
  ["2022-06", "Arcade Bike Physics", ""],
  ["2023-02", "Sim-Cade Vehicle Physics", ""],
  ["2023-07", "Control Rig", "Also open source"],
  ["2023-12", "Humble Bundle: Unity Power Tools", "Sim-Cade in the bundle"],
  ["2024", "Mini Motors", "WTF × IGDC Game Jam"],
  ["2024-07", "Arcade Bike Physics Pro", ""],
  ["2024-11", "Omni Vehicle AI", ""],
  ["2025-02", "Arcade Damage System · Script Preset Creator", ""],
  ["2025-08", "Focus – Task Manager", ""],
  ["2025-09", "Control Rig Pro", ""],
  ["2026-04", "VehiCam", ""],
  ["2026-09", "Poetry of Pace: Rally", "Reveal trailer, free demo on Steam"],
  ["2026-10", "Steam Next Fest", "Poetry of Pace: Rally demo"]
];

// Real Asset Store reviews, quoted exactly.
window.CODRIVER = [
  ["I have tried quite a few other arcade vehicle assets and this is my favourite.", "RikiKlein", "Ash Vehicle Physics"],
  ["If you're looking to have your cars feel anything like NFS, gta, forza, this asset is a great start.", "DOCSKI_GAMES", "Sim-Cade Vehicle Physics"],
  ["Ash himself solved many of my issues and questions.", "Kanopus_", "Ash Vehicle Physics"],
  ["The asset does exactly what it claims and is 5$ You can not go wrong.", "BusterDev", "Arcade Vehicle Physics"],
  ["Trello inside Unity... just amazing!!!", "Malbers", "Focus – Task Manager"],
  ["really useful! should be a default feature inside unity", "NelloF", "Control Rig"]
];
