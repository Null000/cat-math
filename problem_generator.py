import os

def save_problems_to_file(problems, filename):
    """Save problems to file in the format 'problem = answer'"""
    with open(filename, 'w') as f:
        for problem, answer in problems:
            f.write(f"{problem}{answer}\n")

def load_problems_from_file(filename):
    """Load problems from file and return as list of (problem, answer) tuples"""
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

def generate_all_subtraction_problems():
    """Generate all possible subtraction problems (1-20 range)"""
    problems = []
    for num1 in range(1, 21):
        for num2 in range(1, num1 + 1):
            problem = f"{num1} - {num2} = "
            correct_answer = num1 - num2
            problems.append((problem, correct_answer))
    return problems

def initialize_problems(filename="problems_sub20"):
    """Initialize problems by loading from file or generating new ones"""
    all_problems = load_problems_from_file(filename)
    
    if not all_problems:
        print("No saved problems found. Generating all possible subtraction problems...")
        all_problems = generate_all_subtraction_problems()
        save_problems_to_file(all_problems, filename)
        print(f"Generated {len(all_problems)} subtraction problems. Let's start!")
    else:
        print(f"Loaded {len(all_problems)} remaining problems from file. Let's continue!")
    
    return all_problems

def clear_problems_file(filename="problems_sub20"):
    """Delete the problems file when all problems are completed"""
    if os.path.exists(filename):
        os.remove(filename)
        print("Problems file cleared. Next time you run the program, it will generate new problems.")
