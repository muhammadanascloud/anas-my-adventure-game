import inquirer from "inquirer";
import chalk from "chalk";

// Creating a base class for Player and Opponent
class Character {
    name: string;
    fuel: number = 100;

    constructor(name: string) {
        this.name = name;
    }

    // Method to decrease fuel
    fuelDecrease() {
        this.fuel -= 25;
    }

    // Method to increase fuel
    fuelIncrease() {
        this.fuel += 25;
    }

    // Check if the character is defeated (fuel is zero or less)
    isDefeated(): boolean {
        return this.fuel <= 0;
    }
}

// Player class extending Character
class Player extends Character {}

// Opponent class extending Character
class Opponent extends Character {}

// Function to get player name and opponent selection
async function getPlayerDetails() {
    const playerResponse = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Please enter your name:"
    });

    const opponentResponse = await inquirer.prompt({
        type: "list",
        name: "select",
        message: "Select your opponent:",
        choices: ["Skeleton", "Assassin", "Zombie"]
    });

    return { playerName: playerResponse.name, opponentName: opponentResponse.select };
}

// Function to handle the game loop
async function playGame(player: Player, opponent: Opponent) {
    let playAgain = true;

    while (playAgain) {
        console.log(chalk.blue.bold(`${player.name} vs ${opponent.name}`));

        const action = await inquirer.prompt({
            type: "list",
            name: "opt",
            message: "Select your action:",
            choices: ["Attack", "Drink Potion", "Run for your Life"]
        });

        if (action.opt === "Attack") {
            // Randomly determine the success of the attack
            const attackSuccess = Math.random() > 0.5;

            if (attackSuccess) {
                // If the attack is successful, decrease opponent's fuel
                opponent.fuelDecrease();
                console.log(chalk.red.bold(`${opponent.name}: Fuel is ${opponent.fuel}`));
            } else {
                // If the attack fails, decrease player's fuel
                player.fuelDecrease();
                console.log(chalk.red.bold(`${player.name}: Fuel is ${player.fuel}`));
            }

            // Check if the player is defeated
            if (player.isDefeated()) {
                console.log(chalk.red.bold("You lose! Better luck next time."));
                playAgain = await askPlayAgain();
            }
            // Check if the opponent is defeated
            else if (opponent.isDefeated()) {
                console.log(chalk.green.bold("You Won! Congratulations"));
                playAgain = await askPlayAgain();
            } else {
                updateStatus(player, opponent);
            }
        } else if (action.opt === "Drink Potion") {
            // Increase player's fuel when they choose to drink a potion
            player.fuelIncrease();
            console.log(chalk.green.bold(`${player.name}: Fuel is ${player.fuel}`));
        } else if (action.opt === "Run for your Life") {
            // Player chooses to run away, ends the game
            console.log(chalk.red.bold("You lose! Better luck next time."));
            playAgain = await askPlayAgain();
        }
    }
}

// Function to prompt the player if they want to play again
async function askPlayAgain(): Promise<boolean> {
    const response = await inquirer.prompt({
        type: "confirm",
        name: "playAgain",
        message: "Do you want to play again?"
    });

    return response.playAgain;
}

// Function to update and display the current status
function updateStatus(player: Player, opponent: Opponent) {
    console.log(chalk.blue.bold(`${player.name}: Fuel is ${player.fuel}`));
    console.log(chalk.blue.bold(`${opponent.name}: Fuel is ${opponent.fuel}`));
}

// Main function to run the game
(async () => {
    const { playerName, opponentName } = await getPlayerDetails();
    const player = new Player(playerName);
    const opponent = new Opponent(opponentName);

    await playGame(player, opponent);
})();