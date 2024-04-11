const MAX_MEMBERS = 8;

// maxAge = undefined means no max age limit.

const REQUIREMENTS_LIST = [
  { minAge: 18, maxAge: 25, isMaleAllowed: false, isFemaleAllowed: true },
  { minAge: 18, maxAge: 25, isMaleAllowed: true, isFemaleAllowed: false },
  { minAge: 18, maxAge: 25, isMaleAllowed: true, isFemaleAllowed: true },

  { minAge: 25, maxAge: 35, isMaleAllowed: true, isFemaleAllowed: true },
  { minAge: 25, maxAge: 35, isMaleAllowed: false, isFemaleAllowed: true },
  { minAge: 25, maxAge: 35, isMaleAllowed: true, isFemaleAllowed: false },

  {
    minAge: 18,
    maxAge: undefined,
    isMaleAllowed: true,
    isFemaleAllowed: false,
  },
  {
    minAge: 18,
    maxAge: undefined,
    isMaleAllowed: false,
    isFemaleAllowed: true,
  },
  { minAge: 18, maxAge: undefined, isMaleAllowed: true, isFemaleAllowed: true },

  { minAge: 35, maxAge: undefined, isMaleAllowed: true, isFemaleAllowed: true },
  {
    minAge: 35,
    maxAge: undefined,
    isMaleAllowed: true,
    isFemaleAllowed: false,
  },
  {
    minAge: 35,
    maxAge: undefined,
    isMaleAllowed: false,
    isFemaleAllowed: true,
  },
];

const MAX_GROUPS_AMOUNT = 5;

const INTEREST_DESCRIPTIONS = {
  "Ice Skating":
    "Welcome to our frosty realm where gliding on ice is our passion! Whether you're a seasoned skater or just starting out, our group offers a supportive community for all ice skating enthusiasts. Join us as we carve graceful arcs on the glistening ice, share tips and tricks, and embark on thrilling adventures in the world of figure skating, speed skating, or ice hockey. Lace up your skates and let's glide together!",
  Football:
    "Goal! Score big with our Football group, where the beautiful game takes center stage. Whether you're a passionate player or a devoted supporter, join us as we kick off discussions about the world's most popular sport. From analyzing match tactics to celebrating stunning goals, our group is a lively hub for football fans of all levels. So grab your cleats, don your team colors, and let's unite in our love for the game that brings the world together!",
  "American Football":
    "Touchdown! Get ready to tackle the gridiron with our American Football group. Whether you're a die-hard fan of the game or eager to learn more about this adrenaline-fueled sport, you've come to the right place. Join us as we huddle up to discuss game strategies, analyze epic plays, and cheer on our favorite teams. From the thrilling highs of game day victories to the nail-biting tension of close matches, our group is the ultimate touchdown zone for football aficionados!",
  Movies:
    "Lights, camera, action! Welcome to our cinematic oasis, where movie magic comes to life. Join our Movies group to immerse yourself in a world of film appreciation, discussion, and discovery. From blockbuster hits to hidden gems, we celebrate the art of storytelling through the lens of the silver screen. Whether you're a cinephile seeking recommendations or simply love the thrill of movie nights, our group is your ticket to endless cinematic adventures. Grab the popcorn and join us for a reel good time!",
  Reading:
    "Enter the realm of imagination with our Reading group, where every page turn opens new worlds of wonder. Whether you're a bookworm, a bibliophile, or simply enjoy getting lost in a good story, you'll feel right at home here. Join us as we explore literary treasures, share book recommendations, and engage in thought-provoking discussions about our favorite reads. From classics to contemporary fiction, our group is a haven for those who believe in the transformative power of words. Grab your favorite book and join us on a journey through the pages of endless possibilities!",
};

module.exports = {
  MAX_MEMBERS,
  REQUIREMENTS_LIST,
  MAX_GROUPS_AMOUNT,
  INTEREST_DESCRIPTIONS,
};
