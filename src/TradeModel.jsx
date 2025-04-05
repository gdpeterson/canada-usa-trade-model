
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const scenarios = {
  "Canada 2025": {
    tariff: 0.05,
    industrial: 0.15,
    friction: 0.15,
    climate: 0.015,
    geo: 0.2,
    exportDependence: 0.75,
    disruption: 0.95,
    sector: 0.65,
  },
  "Ahead by a Century": {
    tariff: 0.1,
    industrial: 0.05,
    friction: 0.1,
    climate: 0.08,
    geo: 0.8,
    exportDependence: 0.6,
    disruption: 0.85,
    sector: 0.5,
  },
  Courage: {
    tariff: 0.2,
    industrial: 0.08,
    friction: 0.12,
    climate: 0.065,
    geo: 0.6,
    exportDependence: 0.55,
    disruption: 0.9,
    sector: 0.4,
  },
  Bobcaygeon: {
    tariff: 0.25,
    industrial: 0.2,
    friction: 0.18,
    climate: 0.035,
    geo: 0.9,
    exportDependence: 0.65,
    disruption: 0.8,
    sector: 0.6,
  },
  "Locked in the Trunk of a Car": {
    tariff: 0.35,
    industrial: 0.25,
    friction: 0.22,
    climate: 0.015,
    geo: 0.7,
    exportDependence: 0.8,
    disruption: 0.75,
    sector: 0.8,
  },
};

export default function TradeModel() {
  const [scenario, setScenario] = useState("Canada 2025");
  const [customScenario, setCustomScenario] = useState({
    tariff: 0.1,
    industrial: 0.1,
    friction: 0.1,
    climate: 0.05,
    geo: 0.5,
    exportDependence: 0.7,
    disruption: 0.9,
    sector: 0.6,
  });
  const alpha = 0.015;
  const canGDP = 2.6;
  const usGDP = 26.0;

  const values = scenario === "Custom" ? customScenario : scenarios[scenario];
  const climateFriction = values.friction + (1 - Math.exp(-10 * values.climate)) * 0.1;
  const denominator = 1 + values.tariff + values.industrial + climateFriction;
  const trade =
    canGDP * usGDP * values.exportDependence * alpha * (1 - values.geo) / denominator * values.disruption * values.sector;

  const chartData = Object.entries({ ...scenarios, Custom: customScenario }).map(([key, v]) => {
    const climateF = v.friction + (1 - Math.exp(-10 * v.climate)) * 0.1;
    const denom = 1 + v.tariff + v.industrial + climateF;
    const result = canGDP * usGDP * v.exportDependence * alpha * (1 - v.geo) / denom * v.disruption * v.sector;
    return { name: key, trade: parseFloat(result.toFixed(3)) };
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Label htmlFor="scenario">Select Scenario</Label>
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger id="scenario">
              {scenario}
            </SelectTrigger>
            <SelectContent>
              {Object.keys(scenarios).concat("Custom").map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {scenario === "Custom" && (
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(customScenario).map((key) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={customScenario[key]}
                    onChange={(e) =>
                      setCustomScenario({ ...customScenario, [key]: parseFloat(e.target.value) })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-xl font-semibold pt-4">
            Estimated Trade Volume: {trade.toFixed(3)} Trillion USD
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold pb-4">Scenario Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
