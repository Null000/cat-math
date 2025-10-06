def generate_all_subtraction_problems():
    """Generate all possible subtraction problems (1-20 range)"""
    problems = []
    for num1 in range(1, 21):
        for num2 in range(1, num1 + 1):
            problem = f"{num1} - {num2} = "
            correct_answer = num1 - num2
            problems.append((problem, correct_answer))
    return problems
    