import pprint
import sys
from data import rpdr_seasons_data

pp = pprint.PrettyPrinter(indent=4)
EPSILON = sys.float_info.epsilon

def get_season_by_country(seasons, country):
    filtered_seasons = []
    for season in seasons:
        if season["country"] == country:
            filtered_seasons.append(season)
    return filtered_seasons


def get_contestants(seasons, winners_only=False, exclude_winners=False):
    results = []
    for season in seasons:
        contestants = season["contestants"]
        season_episode_count = season["episode count"]
        for contestant in contestants:
            bottom_count = contestant["bottom two"] + (season_episode_count - contestant["episode count"])
            contestant["season episode count"] = season_episode_count
            contestant["bottom count"] = bottom_count

            if winners_only:
                if contestant["won season"]:
                    results.append(contestant)
            elif exclude_winners:
                if not contestant["won season"]:
                    results.append(contestant)
            else:
                results.append(contestant)
    return results


def get_p_performance(
    contestant_data,
    episode_count,
    episode_win_count,
    episode_bottom_count,
):
    percentage_wins = episode_win_count / episode_count
    percentage_bottoms = episode_bottom_count / episode_count
    matches = []

    for contestant in contestant_data:
        contestant_percentage_wins = contestant["challenge wins"] / contestant["season episode count"]
        contestant_percentage_bottoms = contestant["bottom count"] / contestant["season episode count"]

        if (contestant_percentage_wins <= percentage_wins) and (contestant_percentage_bottoms <= percentage_bottoms):
            matches.append(contestant)

    if (len(matches) == 0):
        return EPSILON
    return len(matches) / len(contestant_data)



def main():
    winners = get_contestants(rpdr_seasons_data, True)
    losers = get_contestants(rpdr_seasons_data, False, True)

    # TEST CONTESTANT
    episode_count = 10
    episode_win_count = 1
    episode_bottom_count = 0
    contestants_remaining_count = 3

    p_win = 1 / contestants_remaining_count
    p_lose = 1 - p_win
    p_performance_given_win = get_p_performance(
        winners,
        episode_count,
        episode_win_count,
        episode_bottom_count,
    )
    p_performance_given_lose = get_p_performance(
        losers,
        episode_count,
        episode_win_count,
        episode_bottom_count,
    )

    bayes_numerator = p_performance_given_win * p_win
    bayes_denominator = bayes_numerator + (p_performance_given_lose * p_lose)

    p_win_given_performance = bayes_numerator / bayes_denominator
    print(p_win_given_performance)








if __name__ == '__main__':
    main()