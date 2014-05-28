Relationships

Cell has a pointer to a Warrior — to trace path from A to B and determine obstacles
Warrior has a pointer to a Cell — to be able to rm Cell → Warrioir pointer from Cell in the move phase, coz in the move phase we have state.active pointer to Warrior

state.warriors[color] has pointers to Warriors
warrior.element — is a pointer to DOM element of Warrior