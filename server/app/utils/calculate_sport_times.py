def calculate_sport_times(gender: str, weight: int, age: int) -> int:
    """
    Calculate the recommended sport times per week based on gender, weight, and age.
    """
    sport_times = 3  # Default value

    # Adjust based on age
    if age < 18:
        sport_times = 3  # Kids and teens typically need at least 3 sessions of moderate activity per week
    elif 18 <= age <= 64:
        sport_times = 4  # Adults are typically recommended for 4-5 sessions per week
    else:
        sport_times = 3  # Older adults might require 3-4 sessions per week, often lighter

    # Adjust based on weight (assuming higher weight may need more sessions to maintain health)
    if weight >= 90:
        sport_times += 1  # Add one more session for users with higher weight
    elif weight <= 50:
        sport_times -= 1  # Reduce session count for lighter individuals

    # Adjust based on gender (optional, if there are gender-specific recommendations)
    if gender == "female":
        sport_times -= 1  # Assume slightly fewer sessions for women due to lower muscle mass (based on general health trends)

    # Ensure the sport times is within a reasonable range
    sport_times = max(2, min(sport_times, 7))  # Keep the sport times between 2 and 7

    return sport_times
