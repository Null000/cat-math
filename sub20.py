import random
import time
import os

print("Welcome to Subtraction Practice! Enter 'q' to quit.")

# Function to save problems to file
def save_problems_to_file(problems, filename):
    with open(filename, 'w') as f:
        for problem, answer in problems:
            f.write(f"{problem}{answer}\n")

# Function to load problems from file
def load_problems_from_file(filename):
    problems = []
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            for line in f:
                line = line.strip()
                if line:
                    # Parse problem and answer from file
                    if ' = ' in line:
                        problem_part, answer_part = line.split(' = ')
                        answer = int(answer_part)
                        problems.append((problem_part + ' = ', answer))
    return problems

# Try to load problems from file, or generate all if file doesn't exist
all_problems = load_problems_from_file("problems_sub20")

if not all_problems:
    print("No saved problems found. Generating all possible subtraction problems...")
    # Generate all possible subtraction problems (1-20 range)
    for num1 in range(1, 21):
        for num2 in range(1, num1 + 1):
            problem = f"{num1} - {num2} = "
            correct_answer = num1 - num2
            all_problems.append((problem, correct_answer))
    
    # Shuffle the problems for random order
    random.shuffle(all_problems)
    
    # Save initial problems to file
    save_problems_to_file(all_problems, "problems_sub20")
    print(f"Generated {len(all_problems)} subtraction problems. Let's start!")
else:
    print(f"Loaded {len(all_problems)} remaining problems from file. Let's continue!")

while all_problems:
    # Pick a random problem from the array
    random_index = random.randrange(len(all_problems))
    problem, correct_answer = all_problems[random_index]
    
    # Get user input and measure time
    start_time = time.time()
    user_input = input(problem).strip()
    end_time = time.time()
    response_time = end_time - start_time
    
    # Check for quit
    if user_input.lower() == 'q':
        print("Thanks for practicing! Goodbye.")
        break
    
    # Check if too slow
    if response_time > 5:
        print("Too slow!")
    
    try:
        # Convert user input to int
        user_answer = int(user_input)
        
        # Check if correct
        if user_answer == correct_answer:
            print("Correct! Great job.")
            # Remove the problem from the array after correct and quick solution
            if response_time <= 5:  # Only remove if solved quickly
                all_problems.pop(random_index)
                # Save remaining problems to file
                save_problems_to_file(all_problems, "problems_sub20")
                print(f"Remaining problems: {len(all_problems)}")
        else:
            print(f"Wrong! The correct answer is {correct_answer}.")
    
    except ValueError:
        print("Invalid input. Please enter a number or 'q' to quit.")
        # Move to next problem on invalid input
        all_problems.pop(0)
        # Save remaining problems to file
        save_problems_to_file(all_problems, "problems_sub20")
    
    print()  # Empty line for readability

# Check if all problems are completed
if not all_problems:
    print("Congratulations! You've completed all subtraction problems!")
    # Delete the problems file since all problems are completed
    if os.path.exists("problems_sub20"):
        os.remove("problems_sub20")
        print("Problems file cleared. Next time you run the program, it will generate new problems.")