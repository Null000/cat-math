import random
import time

print("Welcome to Subtraction Practice! Enter 'q' to quit.")

while True:
    # Generate random numbers where first is larger
    num1 = random.randint(1, 20)
    num2 = random.randint(1, num1)
    
    # Create the problem
    problem = f"{num1} - {num2} = "
    
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
    
    # Calculate correct answer
    correct_answer = num1 - num2
    
    try:
        # Convert user input to int
        user_answer = int(user_input)
        
        # Check if correct
        if user_answer == correct_answer:
            print("Correct! Great job.")
        else:
            print(f"Wrong! The correct answer is {correct_answer}.")
    
    except ValueError:
        print("Invalid input. Please enter a number or 'q' to quit.")
    
    print()  # Empty line for readability