#include <iostream>
#include <string>

using namespace std;

const int MAX_LENGTH = 100000;
long long adjustedPosition[MAX_LENGTH];
long long prefixSum[MAX_LENGTH + 1];

bool canMake(int length, int numberOfA, long long k) {
	if (length == 0) {
		return true;
	}

	for (int left = 0; left + length <= numberOfA; ++left) {
		int right = left + length - 1;
		int middle = (left + right) / 2;
		long long middleValue = adjustedPosition[middle];

		long long leftCost = middleValue * (middle - left)
						   - (prefixSum[middle] - prefixSum[left]);
		long long rightCost = (prefixSum[right + 1] - prefixSum[middle + 1])
							- middleValue * (right - middle);

		if (leftCost + rightCost <= k) {
			return true;
		}
	}

	return false;
}

int main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr);

	string s;
	long long k;
	cin >> s >> k;

	int numberOfA = 0;

	for (int i = 0; i < static_cast<int>(s.length()); ++i) {
		if (s[i] == 'a') {
			adjustedPosition[numberOfA] = i - numberOfA;
			numberOfA++;
		}
	}

	prefixSum[0] = 0;

	for (int i = 0; i < numberOfA; ++i) {
		prefixSum[i + 1] = prefixSum[i] + adjustedPosition[i];
	}

	int low = 0;
	int high = numberOfA;
	int answer = 0;

	while (low <= high) {
		int middle = (low + high) / 2;

		if (canMake(middle, numberOfA, k)) {
			answer = middle;
			low = middle + 1;
		} else {
			high = middle - 1;
		}
	}

	cout << answer << '\n';
	return 0;
}
