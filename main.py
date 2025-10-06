import random
import time
from problem_generator import initialize_problems, save_problems_to_file, clear_problems_file

def main():
    print("Welcome to Subtraction Practice! Enter 'q' to quit.")
    
    # Initialize problems
    all_problems = initialize_problems()
    
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
        if response_time > 12:
            print("Too slow!")
        
        try:
            # Convert user input to int
            user_answer = int(user_input)
            
            # Check if correct
            if user_answer == correct_answer:
                print("Correct! Great job Lia!")
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
        
        print()  # Empty line for readability
    
    # Check if all problems are completed
    if not all_problems:
        print("Congratulations! You've completed all subtraction problems!")
        # Delete the problems file since all problems are completed
        clear_problems_file()

if __name__ == "__main__":
    main()
