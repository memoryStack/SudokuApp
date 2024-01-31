// #include </Users/300067724/Desktop/stdc++.h>
#include <iostream>
#include <vector>
using namespace std;

string convertCharacterToString(char c)
{
	string s(1, c);
	return s;
}

int cnt = 0;
vector<vector<int>> choose(vector<int> choices, int k)
{
	cnt++;
	vector<vector<int>> returnVector, subSol;
	if (k == 1)
	{
		vector<int> v;
		v.push_back(choices[0]);
		returnVector.push_back(v);
		return returnVector;
	}
	if (choices.size() >= k)
	{
		int chosen = choices[0];
		choices.erase(choices.begin());
		vector<int> dup = choices;
		while (dup.size() >= (k - 1))
		{
			subSol = choose(dup, k - 1);
			for (int i = 0; i < subSol.size(); i++)
			{
				subSol[i].push_back(chosen);
				returnVector.push_back(subSol[i]);
			}
			dup.erase(dup.begin());
		}
	}

	/* evaluate the sequence here */

	return returnVector;
}

int main()
{

	vector<int> v;

	// int noOfStocks, totalMoney;
	// cin>>noOfStocks>>totalMoney;

	// float moneyPerStock = ceil((float)totalMoney / 10);
	// for(int i = 0;i < noOfStocks;i++){
	// 	// float oneStockValue
	// }

	int n, k;
	cin >> n >> k;
	for (int i = 1; i <= n; i++)
	{
		v.push_back(i);
	}

	while (v.size())
	{
		vector<vector<int>> chosenOnes = choose(v, k);
		v.erase(v.begin());
		for (int i = 0; i < chosenOnes.size(); i++)
		{
			for (int j = 0; j < chosenOnes[i].size(); j++)
			{
				cout << chosenOnes[i][j] - 1 << " ";
			}
			cout << endl;
		}
	}

	cout << cnt << endl;

	return 0;
}
